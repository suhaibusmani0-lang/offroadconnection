import { NextResponse } from 'next/server';
import { checkPincodeServiceability } from '@/lib/pincode';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const info = await checkPincodeServiceability(code);
    return NextResponse.json(info);
  } catch (error: any) {
    return NextResponse.json(
      { serviceable: false, message: error.message || 'Pincode check failed' },
      { status: 500 }
    );
  }
}
