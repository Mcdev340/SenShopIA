import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return { name: 'ShopSense AI', short_name: 'ShopSense', description: 'Achetez malin, vivez mieux.', start_url: '/', display: 'standalone', background_color: '#ffffff', theme_color: '#2563eb', icons: [{ src: '/window.svg', sizes: 'any', type: 'image/svg+xml' }] };
}
