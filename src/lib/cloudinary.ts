import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'offroad-parts';
const apiKey = process.env.CLOUDINARY_API_KEY || '';
const apiSecret = process.env.CLOUDINARY_API_SECRET || '';

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export { cloudinary };

/**
 * Transforms an image or video URL to a high-speed Cloudinary CDN URL with auto optimization (f_auto, q_auto)
 */
export function getOptimizedMediaUrl(
  src: string | undefined | null,
  options: { width?: number; height?: number; crop?: string; isVideo?: boolean } = {}
): string {
  if (!src) {
    return '/assets/images/products/product-placeholder.jpg';
  }

  // If already Cloudinary URL, inject transformations
  if (src.includes('res.cloudinary.com')) {
    const parts = src.split('/upload/');
    if (parts.length === 2) {
      let transformations = 'f_auto,q_auto';
      if (options.width) transformations += `,w_${options.width}`;
      if (options.height) transformations += `,h_${options.height}`;
      if (options.crop) transformations += `,c_${options.crop}`;
      return `${parts[0]}/upload/${transformations}/${parts[1]}`;
    }
    return src;
  }

  // If local asset or external, return clean path
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) {
    return src;
  }

  // Assume public_id in Cloudinary
  const resourceType = options.isVideo ? 'video' : 'image';
  let transformations = 'f_auto,q_auto';
  if (options.width) transformations += `,w_${options.width}`;
  if (options.height) transformations += `,h_${options.height}`;

  return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${transformations}/${src}`;
}

/**
 * Uploads a base64 string or file buffer directly to Cloudinary
 */
export async function uploadToCloudinary(
  fileData: string,
  folder: string = 'offroad_products',
  resourceType: 'image' | 'video' | 'auto' = 'auto'
): Promise<{ url: string; public_id: string; secure_url: string }> {
  try {
    const result = await cloudinary.uploader.upload(fileData, {
      folder,
      resource_type: resourceType,
      overwrite: true,
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });

    return {
      url: result.url,
      public_id: result.public_id,
      secure_url: result.secure_url,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}
