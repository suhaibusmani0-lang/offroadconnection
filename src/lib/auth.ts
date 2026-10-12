import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET_STRING = process.env.JWT_SECRET || 'offroad_secret_jwt_key_super_encrypted_2026_secure';
const secret = new TextEncoder().encode(JWT_SECRET_STRING);

export const AUTH_COOKIE_NAME = 'offroad_customer_token';

export interface CustomerJwtPayload {
  customerId: string;
  phone: string;
  name?: string;
  email?: string;
}

export async function signCustomerToken(payload: CustomerJwtPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);
}

export async function verifyCustomerToken(token: string): Promise<CustomerJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as CustomerJwtPayload;
  } catch (error) {
    return null;
  }
}

export async function getCurrentCustomer(): Promise<CustomerJwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyCustomerToken(token);
}

export function generate6DigitOtp(): string {
  // Generates secure 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}
