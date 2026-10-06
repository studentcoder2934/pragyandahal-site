import assert from 'node:assert/strict'
import { readFile, readdir, stat } from 'node:fs/promises'
import { resolve } from 'node:path'

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map(entry => entry.isDirectory() ? files(`${directory}/${entry.name}`) : `${directory}/${entry.name}`))
  return nested.flat()
}
const all = await files('dist')
const pages = all.filter(path => path.endsWith('.html'))
assert(pages.length >= 14, 'Expected 13 pages and a 404')
const destinations = new Set(pages.map(path => path === 'dist/index.html' ? '/' : path.replace(/^dist/, '').replace(/\/index\.html$/, '')))
for (const file of pages) {
  const html = await readFile(file, 'utf8')
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${file}: exactly one H1`)
  assert.match(html, /<title>[^<]+<\/title>/, `${file}: title`)
  assert.match(html, /<meta name="description" content="[^"]+"/, `${file}: description`)
  assert.match(html, /<main id="main"/, `${file}: semantic main`)
  assert.match(html, /mailto:pragyandahal02@gmail\.com/, `${file}: public contact`)
  assert(!html.includes('—'), `${file}: no em dashes`)
  assert(!html.includes('<!-- page metadata -->'), `${file}: metadata rendered at build time`)
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1])
  assert.equal(ids.length, new Set(ids).size, `${file}: duplicate element ID`)
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (href.startsWith('#')) assert(ids.includes(href.slice(1)), `${file}: broken fragment ${href}`)
    if (!href.startsWith('/')) continue
    const [path, fragment] = href.split('#')
    if (path.includes('.')) {
      assert(await stat(resolve('dist', `.${path}`)).then(() => true).catch(() => false), `${file}: missing asset ${path}`)
    } else {
      assert(destinations.has(path), `${file}: missing route ${path}`)
      if (fragment) {
        const target = await readFile(path === '/' ? 'dist/index.html' : `dist${path}/index.html`, 'utf8')
        assert(target.includes(`id="${fragment}"`), `${file}: broken cross-page fragment`)
      }
    }
  }
  for (const [, path] of html.matchAll(/src="(\/[^"]+)"/g)) {
    assert(await stat(resolve('dist', `.${path}`)).then(() => true).catch(() => false), `${file}: missing script or image ${path}`)
  }
}
const rss = await readFile('dist/rss.xml', 'utf8')
assert.equal((rss.match(/<item>/g) || []).length, (await files('src/content')).filter(path => !path.includes('/projects/') && path.endsWith('.md')).length, 'RSS follows Markdown content')
assert.match(rss, /<link>https?:\/\//, 'RSS has absolute links')
const sitemap = await readFile('dist/sitemap.xml', 'utf8')
assert.equal((sitemap.match(/<url>/g) || []).length, pages.length - 1, 'Every content page in sitemap')
assert.match(sitemap, /<loc>https?:\/\//, 'Sitemap has absolute links')
const essay = await readFile('dist/essays/why-the-physical-world-doesnt-scale-like-software/index.html', 'utf8')
assert.match(essay, /class="footnote-ref"/, 'Footnote reference rendered')
assert.match(essay, /class="footnote-backref"/, 'Footnote return link rendered')
console.log(`Verified ${pages.length} generated pages, local links, assets, metadata, footnotes, RSS, and sitemap.`)
