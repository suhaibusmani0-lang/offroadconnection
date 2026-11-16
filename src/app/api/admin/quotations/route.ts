import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CRMLead from '@/models/CRMLead';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { leadId, items, customerName, customerPhone, vehicle, discount = 0, notes } = body;

    const quoteNumber = `QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsList = Array.isArray(items) && items.length > 0 ? items : [
      { name: body.requested_part || 'OEM Precision Assembly', partNumber: 'OEM-SPEC', price: Number(body.estimated_value) || 25000, quantity: 1 }
    ];

    let subtotal = 0;
    itemsList.forEach((it: any) => {
      subtotal += (Number(it.price) || 0) * (Number(it.quantity) || 1);
    });

    const discountedSubtotal = Math.max(0, subtotal - Number(discount));
    const gst18 = Math.round(discountedSubtotal * 0.18);
    const grandTotal = discountedSubtotal + gst18;

    // Build the high-converting luxury WhatsApp quotation text
    const formattedDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    let itemsText = '';
    itemsList.forEach((item: any, idx: number) => {
      itemsText += `${idx + 1}. *${item.name}*\n   • Part No / OEM: \`${item.partNumber || 'GENUINE-OEM'}\`\n   • Qty: ${item.quantity} | Unit: ₹${Number(item.price).toLocaleString('en-IN')}\n\n`;
    });

    const whatsappMessage = 
`⚜️ *OFFICIAL PROFORMA QUOTATION — DRANPARTS INDIA* ⚜️
*Direct Importers of European Luxury & OEM Components*
━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 *Quotation Ref:* \`${quoteNumber}\`
📅 *Date:* ${formattedDate}
👤 *Client:* ${customerName || 'Valued Patron'}
🚘 *Vehicle:* ${vehicle || 'Verified Chassis'}
━━━━━━━━━━━━━━━━━━━━━━━━━━
*PROPOSED SPARE SPECIFICATION:*
${itemsText}━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 *Taxable Subtotal:* ₹${discountedSubtotal.toLocaleString('en-IN')}
📋 *Applicable GST (18%):* ₹${gst18.toLocaleString('en-IN')}
✨ *FINAL NET PAYABLE:* *₹${grandTotal.toLocaleString('en-IN')}*
━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡️ *ASSURANCE & DISPATCH PROTOCOL:*
✅ 100% Genuine OEM Fitment Guaranteed by Chassis VIN
✅ 6-Month Manufacturer Replacement Guarantee
✅ Express Air Freight (BlueDart Apex) — Dispatch within 24 Hours
✅ Pre-dispatch Video Inspection Provided on WhatsApp

💳 *Instant Secure Payment / UPI Desk:*
https://dranparts.com/checkout?ref=${quoteNumber}

_For assistance, contact Technical Support Desk: +91 88607 18878_`;

    // Update CRM Lead if leadId was provided
    if (leadId) {
      await CRMLead.findByIdAndUpdate(leadId, {
        status: 'QUOTED',
        estimated_value: grandTotal,
        notes: (notes ? notes + ' | ' : '') + `Quotation ${quoteNumber} generated (₹${grandTotal}).`,
      });
    }

    const cleanPhone = (customerPhone || '').replace(/\D/g, '');
    const fullPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const directWhatsappUrl = `https://wa.me/${fullPhone}?text=${encodeURIComponent(whatsappMessage)}`;

    return NextResponse.json({
      success: true,
      quoteNumber,
      summary: {
        subtotal: discountedSubtotal,
        gst18,
        grandTotal,
        itemsCount: itemsList.length,
      },
      whatsappMessage,
      directWhatsappUrl,
    });
  } catch (error: any) {
    console.error('Error creating formal quotation:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
