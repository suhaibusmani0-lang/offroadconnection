import { NextResponse } from 'next/server';

/**
 * Standardized API Response Structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    hasMore?: boolean;
    [key: string]: any;
  };
}

export function apiSuccess<T>(data: T, message?: string, meta?: ApiResponse['meta'], status = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      meta,
    },
    { status }
  );
}

export function apiError(error: string, status = 500, details?: any) {
  return NextResponse.json(
    {
      success: false,
      error,
      details,
    },
    { status }
  );
}

export function apiPaginated<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  additionalMeta?: Record<string, any>
) {
  const totalPages = Math.ceil(total / limit);
  return NextResponse.json({
    success: true,
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages,
      ...additionalMeta,
    },
  });
}

