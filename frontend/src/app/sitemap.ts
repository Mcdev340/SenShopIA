import type { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shopsense-ai.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/products', '/categories', '/brands', '/blog', '/about', '/contact', '/faq', '/terms', '/privacy'];
  return routes.map((route) => ({ url: `${baseUrl}${route}`, lastModified: new Date(), changeFrequency: route === '/blog' ? 'weekly' : 'monthly', priority: route === '' ? 1 : 0.7 }));
}
