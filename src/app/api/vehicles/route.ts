import { NextRequest, NextResponse } from 'next/server';
import FitmentService from '@/services/fitmentService';
import { apiSuccess } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const make = searchParams.get('make')?.trim();

    const makes = FitmentService.getMakes();
    const years = FitmentService.getYears();
    const categories = FitmentService.getCategories();

    let models: string[] = [];
    if (make) {
      models = FitmentService.getModelsForMake(make);
    }

    return apiSuccess({
      makes,
      models,
      years,
      categories,
      selectedMake: make || null,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

