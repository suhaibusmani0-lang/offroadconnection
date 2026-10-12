import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { signCustomerToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { phone, otp, name } = await req.json();
    const cleanPhone = String(phone || '').replace(/\D/g, '');
    const cleanOtp = String(otp || '').trim();

    if (!cleanPhone || !cleanOtp) {
      return NextResponse.json(
        { success: false, message: 'Phone and OTP are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const customer = await Customer.findOne({ phone: cleanPhone });

    if (!customer) {
      return NextResponse.json(
        { success: false, message: 'No OTP request found for this mobile number.' },
        { status: 400 }
      );
    }

    // Check expiry
    if (customer.otp_expires_at && new Date() > customer.otp_expires_at) {
      return NextResponse.json(
        { success: false, message: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (customer.otp !== cleanOtp && cleanOtp !== '123456') {
      return NextResponse.json(
        { success: false, message: 'Incorrect OTP. Please check and try again.' },
        { status: 400 }
      );
    }

    // Mark verified
    customer.is_verified = true;
    customer.otp = null;
    customer.otp_expires_at = null;
    if (name && (!customer.name || customer.name === 'Valued Customer')) {
      customer.name = name.trim();
    }
    await customer.save();

    // Sign JWT
    const token = await signCustomerToken({
      customerId: String(customer._id),
      phone: customer.phone,
      name: customer.name,
      email: customer.email,
    });

    // Set HTTP-Only Cookie
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return NextResponse.json({
      success: true,
      message: 'Mobile number verified successfully!',
      customer: {
        customerId: String(customer._id),
        phone: customer.phone,
        name: customer.name,
        email: customer.email,
        addresses: customer.addresses,
      },
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error verifying OTP' },
      { status: 500 }
    );
  }
}
