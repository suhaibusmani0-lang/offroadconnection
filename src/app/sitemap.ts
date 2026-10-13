import { MetadataRoute } from 'next';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import siteConfig from '@/config/site';
import { LUXURY_MAKES, LUXURY_PART_CATEGORIES } from '@/constants/vehicles';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  // Category & Make Routes
  const categoryRoutes: MetadataRoute.Sitemap = LUXURY_PART_CATEGORIES.map((c) => ({
    url: `${baseUrl}/shop?category=${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const makeRoutes: MetadataRoute.Sitemap = LUXURY_MAKES.map((m) => ({
    url: `${baseUrl}/shop?make=${encodeURIComponent(m.name)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Fetch product slugs from database
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    await connectToDatabase();
    const products = await Product.find({}, { slug: 1, updated_at: 1 }).limit(1000).lean();
    productRoutes = products.map((p: any) => ({
      url: `${baseUrl}/product/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (err) {
    console.warn('Sitemap dynamic product fetch warning:', err);
  }

  return [...staticRoutes, ...categoryRoutes, ...makeRoutes, ...productRoutes];
}

