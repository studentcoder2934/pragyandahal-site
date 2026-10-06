export function makeFeeds({ essays, routes, origin, escapeHtml }) {
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>Pragyan Dahal · Essays</title><link>${origin}/essays</link>
<description>Things I'm thinking through, and stuff I've tried building.</description><language>en-us</language>
<atom:link href="${origin}/rss.xml" rel="self" type="application/rss+xml" />
${essays.map(item => `<item><title>${escapeHtml(item.title)}</title><description>${escapeHtml(item.description)}</description><link>${origin}/essays/${item.slug}</link><guid>${origin}/essays/${item.slug}</guid><pubDate>${new Date(`${item.date}T12:00:00Z`).toUTCString()}</pubDate><category>${escapeHtml(item.status)}</category></item>`).join('\n')}
</channel></rss>`
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(route => `<url><loc>${origin}${route}</loc></url>`).join('\n')}\n</urlset>`
  return {
    '/rss.xml': rss,
    '/sitemap.xml': sitemap,
    '/robots.txt': `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
  }
}
