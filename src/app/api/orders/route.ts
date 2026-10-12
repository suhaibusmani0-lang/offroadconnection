import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import Customer from '@/models/Customer';
import { checkPincodeServiceability } from '@/lib/pincode';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      street,
      city,
      state,
      pincode,
      payment_method,
      payment_status,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      total_amount,
    } = body;

    if (!customer_name || !customer_phone || (!shipping_address && !street) || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Please provide all required customer details, shipping address, and cart items.' },
        { status: 400 }
      );
    }

    const orderNumber = 'ORCP-' + Math.floor(100000 + Math.random() * 900000);

    const cleanPincode = String(pincode || '').replace(/\D/g, '') || '110001';
    const pinInfo = await checkPincodeServiceability(cleanPincode);

    const fullStreet = street || shipping_address;
    const finalCity = city || pinInfo.city || 'Local';
    const finalState = state || pinInfo.state || 'India';

    // 1. Save to MongoDB
    let mongoOrder: any = null;
    try {
      await connectToDatabase();
      mongoOrder = await Order.create({
        order_number: orderNumber,
        customer_phone,
        customer_name,
        customer_email: customer_email || '',
        shipping_address: {
          street: fullStreet,
          city: finalCity,
          state: finalState,
          pincode: cleanPincode,
        },
        items: items.map((item: any) => ({
          product_id: item.id || item.product_id,
          slug: item.slug || '',
          title: item.name || item.title,
          part_number: item.part_number || '',
          price: Number(item.price),
          quantity: Number(item.quantity || 1),
          image: item.image || '',
        })),
        subtotal: Number(total_amount),
        shipping_fee: 0,
        discount: 0,
        total_amount: Number(total_amount),
        payment_method: payment_method || 'cod',
        payment_status: payment_status || (payment_method === 'razorpay' ? 'paid' : 'pending'),
        razorpay_order_id: razorpay_order_id || '',
        razorpay_payment_id: razorpay_payment_id || '',
        razorpay_signature: razorpay_signature || '',
        delivery_status: payment_status === 'paid' ? 'confirmed' : 'placed',
        estimated_delivery_date: pinInfo.estimatedDate,
      });

      // Save/update customer profile with this address
      await Customer.findOneAndUpdate(
        { phone: customer_phone },
        {
          $set: { name: customer_name, email: customer_email || '' },
          $addToSet: {
            addresses: {
              street: fullStreet,
              city: finalCity,
              state: finalState,
              pincode: cleanPincode,
              is_default: true,
            },
          },
        },
        { upsert: true }
      );
    } catch (mongoErr) {
      console.warn('MongoDB order insert warning (continuing to SQL fallback):', mongoErr);
    }

    // 2. Save to MySQL MariaDB (for existing PHP admin & backup sync)
    let orderId: number = Date.now();
    try {
      const orderRes: any = await query(
        `INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, shipping_address, payment_method, total_amount, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderNumber,
          customer_name,
          customer_email || '',
          customer_phone,
          `${fullStreet}, ${finalCity}, ${finalState} - ${cleanPincode}`,
          payment_method || 'COD',
          total_amount,
          payment_status === 'paid' ? 'Paid' : 'Pending',
        ]
      );
      if (orderRes && orderRes.insertId) {
        orderId = orderRes.insertId;

        for (const item of items) {
          await query(
            `INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
             VALUES (?, ?, ?, ?, ?)`,
            [orderId, item.id || 0, item.name || item.title, item.quantity || 1, item.price]
          );
        }

        // Auto CRM lead sync
        await query(
          `INSERT INTO crm_leads (name, email, phone, requested_part, status, estimated_value, notes)
           VALUES (?, ?, ?, ?, 'WON', ?, ?)`,
          [
            customer_name,
            customer_email || null,
            customer_phone,
            `Online Order: ${orderNumber} (${items.length} items)`,
            total_amount,
            `Placed via Next.js checkout. Payment: ${payment_method}. Delivery by: ${pinInfo.estimatedDate}`,
          ]
        );
      }
    } catch (sqlErr) {
      console.warn('MySQL order insert notice:', sqlErr);
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId,
      estimatedDelivery: pinInfo.estimatedDate,
      mongoOrderId: mongoOrder?._id ? String(mongoOrder._id) : null,
    });
  } catch (error: any) {
    console.error('Order placement error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
