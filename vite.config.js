import { defineConfig } from 'vite'
import { readFile } from 'node:fs/promises'
import { makeFeeds } from './src/feeds.js'
import { siteUrl } from './src/site.config.js'

export default defineConfig({
  plugins: [{
    name: 'personal-site-pages',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = new URL(req.url, 'http://localhost').pathname
        if (['/rss.xml', '/sitemap.xml', '/robots.txt'].includes(path)) {
          try {
            const { essays, routes, escapeHtml } = await server.ssrLoadModule('/src/site.js')
            const feeds = makeFeeds({ essays, routes, origin: siteUrl, escapeHtml })
            res.setHeader('Content-Type', path.endsWith('.txt') ? 'text/plain; charset=utf-8' : 'application/xml; charset=utf-8')
            res.end(feeds[path])
          } catch (error) { next(error) }
          return
        }
        if (!req.headers.accept?.includes('text/html')) return next()
        if (path.includes('.')) return next()
        try {
          const { renderDocument, getPage } = await server.ssrLoadModule('/src/site.js')
          const template = await readFile(new URL('./index.html', import.meta.url), 'utf8')
          const html = await server.transformIndexHtml(path, renderDocument(template, path))
          res.statusCode = getPage(path.replace(/\/$/, '') || '/').notFound ? 404 : 200
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(html)
        } catch (error) {
          server.ssrFixStacktrace(error)
          next(error)
        }
      })
    },
  }],
})
