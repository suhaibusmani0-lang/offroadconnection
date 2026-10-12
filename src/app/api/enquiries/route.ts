import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    const res: any = await query(
      `INSERT INTO enquiries (name, email, phone, message) VALUES (?, ?, ?, ?)`,
      [name, email, phone || '', message || '']
    );

    // Also sync to CRM Leads
    try {
      await query(
        `INSERT INTO crm_leads (name, email, phone, notes, status, requested_part)
         VALUES (?, ?, ?, ?, 'NEW', 'Website Contact Enquiry')`,
        [name, email, phone || null, message || 'General contact inquiry']
      );
    } catch (crmErr) {
      console.error('CRM lead sync warning:', crmErr);
    }

    return NextResponse.json({ success: true, id: res.insertId });
  } catch (err: any) {
    console.error('Enquiry error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

