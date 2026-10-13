import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const q = searchParams.get('q') || '';
    const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit')) || 20));
    const page = Math.max(1, Number(searchParams.get('page')) || 1);

    const filter: any = {};
    if (status) filter.delivery_status = status;
    if (q) {
      filter.$or = [
        { order_number: { $regex: q, $options: 'i' } },
        { customer_name: { $regex: q, $options: 'i' } },
        { customer_phone: { $regex: q, $options: 'i' } },
        { 'shipping_address.city': { $regex: q, $options: 'i' } },
      ];
    }

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const pendingCount = await Order.countDocuments({ delivery_status: 'placed' });
    const dispatchedCount = await Order.countDocuments({ delivery_status: 'dispatched' });
    const deliveredCount = await Order.countDocuments({ delivery_status: 'delivered' });

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
      stats: {
        totalOrders: total,
        pendingCount,
        dispatchedCount,
        deliveredCount,
      },
    });
  } catch (error: any) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, delivery_status, payment_status, tracking_number, courier_name, notes } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    const update: any = {};
    if (delivery_status) update.delivery_status = delivery_status;
    if (payment_status) update.payment_status = payment_status;
    if (tracking_number !== undefined) update.tracking_number = tracking_number;
    if (courier_name !== undefined) update.courier_name = courier_name;
    if (notes !== undefined) update.notes = notes;

    const order = await Order.findByIdAndUpdate(id, update, { new: true });
    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

