import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { uploadToCloudinary } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const singleFile = formData.get('file') as File | null;

    const filesToProcess: File[] = [];
    if (files && files.length > 0) {
      filesToProcess.push(...files);
    } else if (singleFile) {
      filesToProcess.push(singleFile);
    }

    if (filesToProcess.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided for upload' },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];

    // Check if Cloudinary is configured with valid credentials
    const isCloudinaryConfigured = Boolean(
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET &&
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY !== ''
    );

    for (const file of filesToProcess) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        continue;
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      if (isCloudinaryConfigured) {
        try {
          const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;
          const result = await uploadToCloudinary(base64Data, 'offroad_products');
          uploadedUrls.push(result.secure_url || result.url);
          continue;
        } catch (cloudErr) {
          console.error('Cloudinary direct upload failed, falling back to local storage:', cloudErr);
        }
      }

      // Local storage fallback: save to public/uploads/products/
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products');
      await fs.mkdir(uploadsDir, { recursive: true });

      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${sanitizedName}`;
      const filePath = path.join(uploadsDir, uniqueName);

      await fs.writeFile(filePath, buffer);
      uploadedUrls.push(`/uploads/products/${uniqueName}`);
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to process any valid images' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      url: uploadedUrls[0],
      urls: uploadedUrls,
      count: uploadedUrls.length,
    });
  } catch (error: any) {
    console.error('Upload API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error during upload' },
      { status: 500 }
    );
  }
}

