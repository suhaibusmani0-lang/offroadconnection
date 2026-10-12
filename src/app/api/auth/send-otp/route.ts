import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { generate6DigitOtp } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    const cleanPhone = String(phone || '').replace(/\D/g, '');

    if (cleanPhone.length !== 10) {
      return NextResponse.json(
        { success: false, message: 'Invalid 10-digit mobile number' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const otp = generate6DigitOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    let customer = await Customer.findOne({ phone: cleanPhone });

    if (!customer) {
      customer = new Customer({
        phone: cleanPhone,
        otp,
        otp_expires_at: expiresAt,
        is_verified: false,
      });
    } else {
      customer.otp = otp;
      customer.otp_expires_at = expiresAt;
    }

    await customer.save();

    console.log(`[SMS Gateway Simulator] OTP sent to +91 ${cleanPhone}: ${otp}`);

    // In production, integrate SMS API here (e.g. Fast2SMS, Twilio, MSG91)
    // We return testOtp in response for instantaneous testing out-of-the-box
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully to your mobile number!',
      testOtp: otp, // For instant testing
    });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error sending OTP' },
      { status: 500 }
    );
  }
}
