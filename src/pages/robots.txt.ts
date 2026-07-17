import type { APIRoute } from "astro";

const getRobotsTxt = (sitemapURL: URL, llmsURL: URL) => `
User-agent: *
Allow: /

# LLM-readable site index (https://llmstxt.org)
# ${llmsURL.href}

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);
  const llmsURL = new URL("llms.txt", site);
  return new Response(getRobotsTxt(sitemapURL, llmsURL));
};
