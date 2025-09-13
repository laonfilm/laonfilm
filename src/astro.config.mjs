import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://laonfilm.com',
  output: 'hybrid', // This allows some routes to be server-rendered
  adapter: cloudflare(),
  vite: {
    build: {
      assetsInlineLimit: 4096, // Inline assets smaller than 4KB (your CSS is 2.7KB)
    }
  }
});