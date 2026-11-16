import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code')?.trim().toUpperCase();
    const subtotal = Number(searchParams.get('subtotal')) || 0;

    if (!code) {
      // List active public coupons for marketing banner
      const activeCoupons = await Coupon.find({
        is_active: true,
        valid_until: { $gte: new Date() },
      })
        .select('code description discount_type discount_value min_order_amount')
        .limit(5)
        .lean();

      return NextResponse.json({ success: true, coupons: activeCoupons });
    }

    // Specific coupon validation
    const coupon = await Coupon.findOne({ code, is_active: true });

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired promotional coupon code.' },
        { status: 404 }
      );
    }

    const now = new Date();
    if (coupon.valid_until < now || coupon.valid_from > now) {
      return NextResponse.json(
        { success: false, error: 'This coupon has expired.' },
        { status: 400 }
      );
    }

    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return NextResponse.json(
        { success: false, error: 'Coupon usage limit has been exceeded.' },
        { status: 400 }
      );
    }

    if (subtotal < coupon.min_order_amount) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum order value of ₹${coupon.min_order_amount.toLocaleString('en-IN')} required to apply this coupon.`,
        },
        { status: 400 }
      );
    }

    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = (subtotal * coupon.discount_value) / 100;
      if (coupon.max_discount_amount && coupon.max_discount_amount > 0) {
        discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
      }
    } else {
      discountAmount = Math.min(coupon.discount_value, subtotal);
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discount_amount: Math.round(discountAmount),
      },
    });
  } catch (error: any) {
    console.error('Error validating coupon:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const {
      code,
      description,
      discount_type,
      discount_value,
      min_order_amount,
      max_discount_amount,
      valid_until,
      usage_limit,
    } = body;

    if (!code || !discount_value || !valid_until) {
      return NextResponse.json(
        { success: false, error: 'Code, discount value, and validity date are required.' },
        { status: 400 }
      );
    }

    const newCoupon = await Coupon.create({
      code: code.trim().toUpperCase(),
      description,
      discount_type: discount_type || 'percentage',
      discount_value: Number(discount_value),
      min_order_amount: Number(min_order_amount) || 0,
      max_discount_amount: Number(max_discount_amount) || 0,
      valid_until: new Date(valid_until),
      usage_limit: Number(usage_limit) || 1000,
      is_active: true,
    });

    return NextResponse.json({ success: true, coupon: newCoupon });
  } catch (error: any) {
    console.error('Error creating coupon:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
