import { build } from 'vite'
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { makeFeeds } from '../src/feeds.js'

await build({ build: { ssr: 'src/site.js', outDir: '.build/server', emptyOutDir: true } })
const { routes, essays, renderDocument, escapeHtml } = await import('../.build/server/site.js')
await build()
const template = await readFile('dist/index.html', 'utf8')
for (const route of [...routes, '/404']) {
  const output = route === '/' ? 'dist/index.html' : route === '/404' ? 'dist/404.html' : `dist${route}/index.html`
  await mkdir(resolve(output, '..'), { recursive: true })
  await writeFile(output, renderDocument(template, route))
}
const origin = (process.env.SITE_URL || 'http://localhost:5173').replace(/\/$/, '')
if (!/^https?:\/\/[^/]+$/.test(origin)) throw new Error('SITE_URL must be an absolute origin with no path')
for (const [path, content] of Object.entries(makeFeeds({ essays, routes, origin, escapeHtml }))) {
  await writeFile(`dist${path}`, content)
}
await rm('.build', { recursive: true, force: true })
console.log(`Generated ${routes.length} complete pages, RSS, sitemap, and 404.`)
if (!process.env.SITE_URL) console.log('Preview metadata uses localhost. Set SITE_URL to the public origin before deployment.')
