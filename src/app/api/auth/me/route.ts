import { NextResponse } from 'next/server';
import { getCurrentCustomer, AUTH_COOKIE_NAME } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const payload = await getCurrentCustomer();
    if (!payload) {
      return NextResponse.json({ customer: null }, { status: 401 });
    }

    await connectToDatabase();
    const customer = await Customer.findOne({ phone: payload.phone }).lean();

    if (!customer) {
      return NextResponse.json({ customer: null }, { status: 401 });
    }

    return NextResponse.json({
      customer: {
        customerId: String(customer._id),
        phone: customer.phone,
        name: customer.name,
        email: customer.email,
        addresses: customer.addresses || [],
      },
    });
  } catch (error: any) {
    return NextResponse.json({ customer: null }, { status: 500 });
  }
}
