import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ACADEX - Gestion Scolaire Élite',
    short_name: 'ACADEX',
    description: 'Plateforme de gestion scolaire premium pour l\'excellence éducative au Bénin.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#14532D',
    icons: [
      {
        src: 'https://picsum.photos/seed/acadex-icon-192/192/192',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: 'https://picsum.photos/seed/acadex-icon-512/512/512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    orientation: 'portrait',
    scope: '/',
  };
}
