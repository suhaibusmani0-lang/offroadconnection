import Razorpay from 'razorpay';
import crypto from 'crypto';

const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_samplekey123';
const keySecret = process.env.RAZORPAY_KEY_SECRET || 'samplesecretkey456';

export const razorpayInstance = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

export interface CreateOrderParams {
  amountInRupees: number;
  receipt: string;
  notes?: Record<string, string>;
}

/**
 * Creates a Razorpay Order
 */
export async function createRazorpayOrder({ amountInRupees, receipt, notes }: CreateOrderParams) {
  const options = {
    amount: Math.round(amountInRupees * 100), // Amount in paise
    currency: 'INR',
    receipt: receipt.slice(0, 40),
    notes: notes || {},
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    return order;
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    throw error;
  }
}

/**
 * Verifies Razorpay Payment Signature
 */
export function verifyRazorpaySignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): boolean {
  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  return generatedSignature === razorpaySignature;
}
