import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CRMLead from '@/models/CRMLead';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const q = searchParams.get('q') || '';

    const filter: any = {};
    if (status) filter.status = status;
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
        { vehicle_info: { $regex: q, $options: 'i' } },
        { requested_part: { $regex: q, $options: 'i' } },
      ];
    }

    const leads = await CRMLead.find(filter).sort({ created_at: -1 }).lean();

    // Stats
    const totalLeads = await CRMLead.countDocuments();
    const newLeads = await CRMLead.countDocuments({ status: 'NEW' });
    const quotedLeads = await CRMLead.countDocuments({ status: 'QUOTED' });
    const wonLeads = await CRMLead.countDocuments({ status: 'WON' });

    const pipelineAggregate = await CRMLead.aggregate([
      { $match: { status: { $ne: 'LOST' } } },
      { $group: { _id: null, total: { $sum: '$estimated_value' } } },
    ]);
    const pipelineVal = pipelineAggregate[0]?.total || 0;

    const wonAggregate = await CRMLead.aggregate([
      { $match: { status: 'WON' } },
      { $group: { _id: null, total: { $sum: '$estimated_value' } } },
    ]);
    const wonVal = wonAggregate[0]?.total || 0;

    return NextResponse.json({
      success: true,
      leads,
      stats: {
        totalLeads,
        newLeads,
        quotedLeads,
        wonLeads,
        pipelineVal,
        wonVal,
      },
    });
  } catch (error: any) {
    console.error('Error fetching CRM leads:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, phone, email, vehicle_info, requested_part, estimated_value, status, notes, source } = body;

    if (!name || !phone || !requested_part) {
      return NextResponse.json(
        { success: false, error: 'Name, phone, and requested part are required.' },
        { status: 400 }
      );
    }

    const lead = await CRMLead.create({
      name,
      phone,
      email,
      vehicle_info,
      requested_part,
      estimated_value: Number(estimated_value) || 0,
      status: status || 'NEW',
      notes,
      source: source || 'Admin Manual',
    });

    return NextResponse.json({ success: true, lead });
  } catch (error: any) {
    console.error('Error creating CRM lead:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, status, notes, estimated_value } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Lead ID is required.' }, { status: 400 });
    }

    const update: any = {};
    if (status) update.status = status;
    if (notes !== undefined) update.notes = notes;
    if (estimated_value !== undefined) update.estimated_value = Number(estimated_value);

    const lead = await CRMLead.findByIdAndUpdate(id, update, { new: true });
    return NextResponse.json({ success: true, lead });
  } catch (error: any) {
    console.error('Error updating CRM lead:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Lead ID required' }, { status: 400 });
    }

    await CRMLead.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

