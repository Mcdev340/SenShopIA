import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shopsense-ai.com';
  return { rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/dashboard/', '/cart', '/checkout', '/profile'] }, sitemap: `${baseUrl}/sitemap.xml` };
}
