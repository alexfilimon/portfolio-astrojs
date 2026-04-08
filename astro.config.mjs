import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://alexfilimon.dev',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    icon({
      include: {
        lucide: ['sun', 'moon', 'globe', 'mail', 'send', 'linkedin', 'github', 'book-open', 'file-text'],
      },
    }),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          ru: 'ru-RU',
        },
      },
    }),
  ],
});
