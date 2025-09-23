import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://laonfilm.com',

  // Use static output so Cloudflare Pages Functions are respected
  output: 'static',

  // Cloudflare adapter in "directory" mode (so /functions/ is deployed)
  adapter: cloudflare({
    mode: 'directory'
  }),

  integrations: [
    sitemap({
      filter: (page) => {
        return !page.includes('/api/') &&
               !page.includes('/rss.xml') &&
               !page.includes('/search');
      }
    })
  ],

  vite: {
    build: {
      assetsInlineLimit: 4096,
    }
  }
});
