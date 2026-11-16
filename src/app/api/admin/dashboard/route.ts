import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import CRMLead from '@/models/CRMLead';
import Product from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // 1. Order Analytics
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.countDocuments({ payment_status: 'paid' });
    const pendingOrders = await Order.countDocuments({
      delivery_status: { $in: ['placed', 'confirmed', 'dispatched'] },
    });

    const revenueAggregate = await Order.aggregate([
      { $match: { payment_status: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$total_amount' } } },
    ]);
    const paidRevenue = revenueAggregate[0]?.totalRevenue || 0;

    const allOrdersAggregate = await Order.aggregate([
      { $group: { _id: null, totalGross: { $sum: '$total_amount' } } },
    ]);
    const grossMerchandiseValue = allOrdersAggregate[0]?.totalGross || 0;

    const avgOrderValue = totalOrders > 0 ? Math.round(grossMerchandiseValue / totalOrders) : 0;

    // 2. CRM Leads Analytics
    const totalLeads = await CRMLead.countDocuments();
    const newLeads = await CRMLead.countDocuments({ status: 'NEW' });
    const quotedLeads = await CRMLead.countDocuments({ status: 'QUOTED' });
    const wonLeads = await CRMLead.countDocuments({ status: 'WON' });

    const pipelineAggregate = await CRMLead.aggregate([
      { $match: { status: { $ne: 'LOST' } } },
      { $group: { _id: null, total: { $sum: '$estimated_value' } } },
    ]);
    const pipelineValue = pipelineAggregate[0]?.total || 0;

    const winRate =
      totalLeads > 0 ? Math.round((wonLeads / (wonLeads + (await CRMLead.countDocuments({ status: 'LOST' })) || 1)) * 100) : 0;

    // 3. Products & Stock Telemetry
    const totalProducts = await Product.countDocuments();
    const inStockProducts = await Product.countDocuments({ in_stock: true });
    const lowStockAlerts = await Product.find({
      $or: [{ stock_quantity: { $lte: 5 } }, { in_stock: false }],
    })
      .select('title part_number price stock_quantity in_stock make')
      .limit(10)
      .lean();

    // 4. Breakdown by Luxury Make (from products)
    const makesDistribution = await Product.aggregate([
      { $match: { make: { $ne: '' } } },
      { $group: { _id: '$make', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    // 5. Recent Activity
    const recentOrders = await Order.find()
      .sort({ created_at: -1 })
      .limit(6)
      .select('order_number customer_name customer_phone total_amount payment_status delivery_status created_at')
      .lean();

    const recentLeads = await CRMLead.find()
      .sort({ created_at: -1 })
      .limit(6)
      .select('name phone vehicle_info requested_part estimated_value status created_at')
      .lean();

    return NextResponse.json({
      success: true,
      metrics: {
        revenue: {
          paidRevenue,
          grossMerchandiseValue,
          avgOrderValue,
          currency: 'INR',
        },
        orders: {
          total: totalOrders,
          paid: paidOrders,
          pending: pendingOrders,
        },
        crm: {
          totalLeads,
          newLeads,
          quotedLeads,
          wonLeads,
          pipelineValue,
          winRate,
        },
        inventory: {
          totalProducts,
          inStock: inStockProducts,
          lowStockCount: lowStockAlerts.length,
        },
      },
      makesDistribution: makesDistribution.map((m) => ({ make: m._id, count: m.count })),
      lowStockAlerts,
      recentOrders,
      recentLeads,
    });
  } catch (error: any) {
    console.error('Error fetching admin dashboard analytics:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
