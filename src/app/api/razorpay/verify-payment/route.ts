import { NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_number,
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json(
        { success: false, message: 'Missing payment parameters' },
        { status: 400 }
      );
    }

    // Verify signature
    let isValid = false;
    // In test mode, allow verification with fallback if secret is demo
    if (process.env.RAZORPAY_KEY_SECRET === 'samplesecretkey456') {
      isValid = true; // Test mode simulation
    } else {
      isValid = verifyRazorpaySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );
    }

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid payment signature. Verification failed.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // If order_number is provided, update existing order
    if (order_number) {
      const order = await Order.findOne({ order_number });
      if (order) {
        order.payment_status = 'paid';
        order.razorpay_order_id = razorpay_order_id;
        order.razorpay_payment_id = razorpay_payment_id;
        order.razorpay_signature = razorpay_signature || '';
        order.delivery_status = 'confirmed';
        await order.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully!',
      payment_id: razorpay_payment_id,
    });
  } catch (error: any) {
    console.error('Verify payment error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
