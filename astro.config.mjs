import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages 配信を前提に site / base を組み立てる。
// 独自ドメインに切り替えたら SITE_URL を上書きし、BASE_PATH を空文字にすればよい。
const site = process.env.SITE_URL ?? 'https://shsw228.github.io';
const base = process.env.BASE_PATH ?? '/hume-press';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
