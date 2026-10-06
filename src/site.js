import { Model } from './drawings.js'
import { escapeHtml, readingTime, formatDate } from './lib/format.js'
import { EssayCard, ProjectCard, SectionHeader, Figure, QuestionList, Prose } from './components.js'
import MarkdownIt from 'markdown-it'
import footnote from 'markdown-it-footnote'
import { parse as parseYaml } from 'yaml'
import { contact, siteUrl } from './site.config.js'

const essayFiles = import.meta.glob('./content/*.md', { eager: true, query: '?raw', import: 'default' })
const projectFiles = import.meta.glob('./content/projects/*.md', { eager: true, query: '?raw', import: 'default' })

function parseDocument(raw, path) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) throw new Error(`${path}: YAML frontmatter is required`)
  const data = parseYaml(match[1])
  const content = match[2]
  const slug = path.split('/').pop().replace(/\.md$/, '')
  for (const field of ['title', 'description', 'status']) {
    if (typeof data[field] !== 'string' || !data[field].trim()) throw new Error(`${path}: missing ${field}`)
  }
  if (!Array.isArray(data.tags)) throw new Error(`${path}: tags must be a YAML list`)
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date
  if (!path.includes('/projects/') && (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)))) throw new Error(`${path}: a valid date is required`)
  return { ...data, date, tags: data.tags, slug, body: content.trim() }
}

const essays = Object.entries(essayFiles).map(([path, raw]) => parseDocument(raw, path)).sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
const projects = Object.entries(projectFiles).map(([path, raw]) => parseDocument(raw, path))
const projectOrder = ['khaaloop', 'local-voice-ai']
projects.sort((a, b) => (a.order ?? (projectOrder.indexOf(a.slug) < 0 ? 999 : projectOrder.indexOf(a.slug))) - (b.order ?? (projectOrder.indexOf(b.slug) < 0 ? 999 : projectOrder.indexOf(b.slug))))

const questions = [
  'Why is so much construction still done by hand?',
  'Which housing costs could better technology actually bring down?',
  'How much does infrastructure cost because people and schedules are hard to coordinate?',
  'If AI gets cheap, what still makes the physical work expensive?',
  'Where are people paying more because they can\'t get the information they need?',
  'When does it make sense to run the whole operation yourself instead of building a marketplace?',
  'How do you know when to drop a business idea?',
  'What would make me change my mind about all this?'
]

const md = new MarkdownIt({ html: false, typographer: false }).use(footnote)
md.renderer.rules.heading_open = (tokens, index) => {
  const text = tokens[index + 1].content
  const id = headingId(text)
  return `<${tokens[index].tag} id="${id}">`
}
function headingId(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
function markdown(source) { return md.render(source) }

function navLink(path, label, current) {
  const active = current === path || (path !== '/' && current.startsWith(`${path}/`))
  return `<a href="${path}"${active ? ' aria-current="page"' : ''}>${label}</a>`
}

function shell(content, path) {
  return `<a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <a class="wordmark" href="/" aria-label="Pragyan Dahal, home">Pragyan Dahal<span class="wordmark-period">.</span></a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="menu-icon" aria-hidden="true"></span><span class="sr-only">Open navigation</span></button>
      <nav id="site-nav" class="site-nav" aria-label="Main navigation">
        ${navLink('/essays', 'Writing', path)}${navLink('/projects', 'Projects', path)}${navLink('/interests', 'Interests', path)}${navLink('/about', 'About', path)}${navLink('/now', 'Now', path)}
      </nav>
    </header>
    <main id="main" tabindex="-1">${content}</main>
    <footer class="site-footer">
      <div class="footer-top"><a class="footer-name" href="/">Pragyan Dahal</a><a class="contact-email" href="mailto:${contact.email}">${contact.email}<span aria-hidden="true">↗</span></a></div>
      <div class="footer-bottom"><span>Stanford, California</span><span>© 2026</span><a href="/rss.xml">RSS <span aria-hidden="true">↗</span></a><a href="#main" class="back-top">Back to top ↑</a></div>
    </footer>`
}

function buildingDrawing() {
  return `<svg viewBox="0 0 400 430" role="img" aria-labelledby="building-title building-desc">
    <title id="building-title">A repeatable structure, a particular place</title>
    <desc id="building-desc">An exploded drawing of a building. A roof, frame and foundation need to be assembled on a site, unlike copies of a digital file.</desc>
    <g class="sketch-ground"><path d="M34 332L199 244L367 330L200 421Z" fill="#ecebe3"/><path d="M34 332L200 421L367 330M34 332L199 244L367 330"/></g>
    <g class="sketch-guides"><path d="M93 151V348M200 208V404M306 151V348M200 92V289"/></g>
    <g class="sketch-base"><path d="M93 311L200 255L306 311L200 368Z" fill="#e8e5da"/><path d="M93 311V322L200 379L306 322V311M93 311L200 368L306 311M200 368V379"/></g>
    <g class="sketch-frame"><path pathLength="1" d="M101 305V180L200 127L298 180V305M200 357V232L101 180M200 232L298 180M200 127V253"/><path pathLength="1" d="M101 242L200 295L298 242M150 206V332M249 206V332" class="sketch-secondary"/></g>
    <g class="sketch-roof"><path d="M83 129L200 67L316 129L200 191Z" fill="#eeeae0"/><path d="M83 129L200 191L316 129M83 129L200 67L316 129M83 129V136L200 198L316 136V129M200 191V198"/></g>
    <g class="sketch-labels"><path d="M310 132H366M307 242H366M306 319H366"/><text x="331" y="123">DESIGN</text><text x="321" y="233">ASSEMBLY</text><text x="341" y="310">SITE</text></g>
    <g class="sketch-note"><path d="M48 388L79 404"/><text x="35" y="417">A PARTICULAR PLACE</text></g>
  </svg>`
}

function homepage() {
  const selected = essays.filter(essay => essay.featured).sort((a, b) => a.featured - b.featured).slice(0, 3)
  return `<section class="hero wrap">
      <div class="hero-copy">
        <p class="eyebrow hero-eyebrow">Software, systems &amp; the built world</p>
        <h1>The physical world should be <em>easier to build.</em></h1>
        <p class="hero-deck">I'm interested in how we could make housing and infrastructure cheaper and easier to build. Software is part of that, but I want to understand the physical work too.</p>
        <div class="hero-byline"><span>Pragyan Dahal</span><span>First year at Stanford</span></div>
      </div>
      ${Figure(buildingDrawing(), '', 'hero-figure')}
      <div class="hero-bottom"><span>Writing &amp; experiments · October 2026</span><a href="#writing">Read on <span aria-hidden="true">↓</span></a></div>
    </section>

    <section class="intro-band"><div class="wrap intro-grid" data-reveal><span class="eyebrow">Where I'm starting</span><div><p>What makes construction slow and expensive, and which parts could we change?</p><p class="intro-context">I'm exploring EE and CS, along with construction, manufacturing, and automation. I don't have a solution in mind yet, I'm trying to understand how the process works.</p><a class="text-link" href="/about">A little about me <span aria-hidden="true">↗</span></a></div></div></section>

    <section class="section wrap" id="writing">${SectionHeader('Selected writing', "Stuff I'm trying to figure out", "I'm using these drafts to write down what I currently think and what I still need to understand.")}
      <div class="essay-grid">${selected.map(essay => EssayCard(essay)).join('')}</div>
      <a class="section-link" href="/essays">All writing <span aria-hidden="true">↗</span></a>
    </section>

    <section class="section project-section"><div class="wrap">${SectionHeader('Selected projects', "Things I've tried", "A surplus-food marketplace and a local voice system. I wrote up what happened with each.")}
      <div class="project-grid">${projects.map(ProjectCard).join('')}</div>
    </div></section>

    <section class="questions-section wrap" id="questions">${SectionHeader('Still wondering', 'Still stuck on these')}
      <div class="questions-layout">${Model('assembly', 'questions', 'questions-model')}${QuestionList([questions[1], questions[2], questions[3]])}</div>
      <a class="text-link" href="/interests">The rest of the list <span aria-hidden="true">↗</span></a>
    </section>

    <section class="now-strip"><div class="wrap now-grid" data-reveal><span class="eyebrow">Now · October 2026</span><p>I'm in my first year at Stanford, exploring EE / CS and spending time on local voice AI and construction.</p><a class="text-link" href="/now">More on now <span aria-hidden="true">↗</span></a></div></section>`
}

function pageIntro(eyebrow, title, deck) {
  return `<section class="page-intro wrap"><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p>${deck}</p></section>`
}

function essaysPage() {
  return `${pageIntro('Writing', 'Writing', "These are drafts I'm using to write down what I currently think, so some of this will change.")}
    <section class="page-content wrap"><div class="essay-list">${essays.map(essay => EssayCard(essay)).join('')}</div></section>`
}

function projectsPage() {
  return `${pageIntro('Project notes', 'Projects', "I've been working on a surplus-food marketplace and a local conversational voice system. Here's what I tried and how it went.")}
    <section class="page-content wrap"><div class="project-grid project-grid-page">${projects.map(ProjectCard).join('')}</div><div class="quiet-note"><span class="eyebrow">More soon</span><p>I'll add other projects here as I work on them.</p></div></section>`
}

function aboutPage() {
  return `${pageIntro('About', 'About me', "I'm Pragyan Dahal, a first-year at Stanford.")}
    <section class="prose-layout wrap"><aside class="margin-note"><span class="eyebrow">Currently</span><p>Mostly exploring EE / CS. Also spending time on construction and AI.</p></aside><article class="prose">
      <p>I like building things, and I tend to ask a lot of questions about why we're building them a particular way. I'm interested in electrical engineering, computer science, AI, and entrepreneurship, but I haven't decided where to concentrate yet.</p>
      <p>Most of what I've built so far has been software. It's a fairly cheap way to try an idea and find out which parts I don't understand. I've worked on Khaaloop, a surplus-food marketplace, and a local conversational voice AI system.</p>
      <p>Lately I've been more interested in construction, housing, infrastructure, and manufacturing. With software you can often make another copy fairly cheaply. Building another home still means dealing with land, materials, people, money, and approvals, even if you already have the design.</p>
      <h2>What I want to understand</h2>
      <p>I'm interested in why access to digital tools can improve so much while physical living conditions remain difficult to improve. You can have a phone with plenty of software and information and still not have a decent place to live.</p>
      <p>I'd like to learn how much easier it could become to build housing and infrastructure, and what would need to change for that to happen. Robotics, manufacturing, logistics, software, and the institutions around construction all seem relevant. I don't know enough yet to say which part I should work on.</p>
      <p>For now I'm exploring those topics and trying to get more specific about the problems. Some of these interests might stick and some won't, I need to spend more time on them before deciding.</p>
    </article></section>`
}

function interestsPage() {
  const groups = [
    ['Physical systems', ['Construction', 'Housing', 'Infrastructure', 'Manufacturing', 'Robotics', 'Energy', 'Logistics']],
    ['Intelligence', ['Artificial intelligence', 'Human-computer interaction', 'Autonomous systems', 'Local AI', 'Voice interfaces']],
    ['Companies and markets', ['Entrepreneurship', 'Marketplaces', 'Distribution', 'Incentives', 'Organizational design', 'International markets']]
  ]
  return `${pageIntro('Interests', 'What has my attention', "EE, CS, construction, and a few related things I'm interested in. I haven't narrowed this down very much yet.")}
    <section class="page-content wrap"><div class="interest-groups">${groups.map(([title, items], index) => `<article class="interest-group"><span class="eyebrow">0${index + 1}</span><div><h2>${title}</h2><ul>${items.map(item => `<li>${item}</li>`).join('')}</ul></div></article>`).join('')}</div>
      <div class="interest-questions">${SectionHeader('The live list', 'Questions I keep coming back to')}
        ${QuestionList(questions.concat(['Which constraints in the physical world are fundamental, and which only look fundamental?', 'Why do technically superior products often lose?']))}
      </div>
    </section>`
}

function nowPage() {
  return `${pageIntro('Now', 'Now', "What I'm up to right now. I'll update this when things change.")}
    <section class="now-page wrap"><p class="now-date"><span class="status-dot"></span> October 2026</p>
      <div class="now-row"><span class="eyebrow">Where</span><p>First year at Stanford University.</p></div>
      <div class="now-row"><span class="eyebrow">Exploring</span><p>EE / CS, construction, infrastructure, AI systems, robotics, automation, and how businesses actually work.</p></div>
      <div class="now-row"><span class="eyebrow">Building / experimenting</span><p>Local voice AI, Khaaloop, and smaller experiments. Khaaloop hasn't worked commercially so far. The voice system is still very much a work in progress.</p></div>
      <div class="now-row"><span class="eyebrow">Thinking about</span><p>I'm trying to understand construction and how software, manufacturing, or automation could change parts of it. I'm also thinking about how to choose something I'd want to work on for years.</p></div>
      </section>`
}

function detailPage(item, type) {
  const isEssay = type === 'essay'
  const prefix = isEssay ? '/essays' : '/projects'
  const back = isEssay ? 'All writing' : 'All projects'
  const headings = [...item.body.matchAll(/^## (.+)$/gm)].map(match => match[1])
  const kicker = isEssay ? `<span>${item.status === 'draft' ? 'Working draft' : 'Essay'}</span><time datetime="${item.date}">${formatDate(item.date)}</time><span>${readingTime(item.body)}</span>` : `<span>Project notes</span><span>${escapeHtml(item.status)}</span>`
  const visuals = {
    'local-voice-ai': ['voice', 'Speech → turn detection → transcription → reply → TTS → playback'],
    'khaaloop': ['marketplace', 'The intended flow: a listing, a reservation, and a pickup.'],
    'why-the-physical-world-doesnt-scale-like-software': ['replication', 'A conceptual comparison of copying software and repeating physical work.'],
    'what-would-make-housing-abundant': ['assembly', 'Conceptual assembly model, not a construction plan.'],
  }
  const visual = visuals[item.slug]
  const diagram = visual ? Figure(Model(visual[0], 'article'), visual[1], 'article-model') : ''

  const next = isEssay ? essays[(essays.findIndex(essay => essay.slug === item.slug) + 1) % essays.length] : null
  return `<section class="article-intro wrap"><a class="back-link" href="${prefix}">← ${back}</a><span class="eyebrow">${isEssay ? 'Writing' : 'Experiment'}</span><h1>${escapeHtml(item.title)}</h1><p class="article-deck">${escapeHtml(item.description)}</p><div class="article-meta">${kicker}</div></section>
    <section class="article-layout wrap"><aside class="article-aside"><span class="eyebrow">On this page</span><nav class="article-toc" aria-label="Article sections">${headings.map(heading => `<a href="#${headingId(heading)}">${escapeHtml(heading)}</a>`).join('')}</nav></aside>${Prose(`${diagram}${markdown(item.body)}<div class="article-end">${next ? `<a class="text-link" href="/essays/${next.slug}">Next draft: ${escapeHtml(next.title)} <span aria-hidden="true">↗</span></a>` : `<a class="text-link" href="${prefix}">Back to the projects <span aria-hidden="true">↗</span></a>`}</div>`)}</section>`
}

const staticPages = {
  '/': { title: 'Pragyan Dahal · Notes on building', description: "Copying software is cheap. Building a home isn't. Writing and experiments by Pragyan Dahal, a first-year at Stanford.", render: homepage },
  '/about': { title: 'About · Pragyan Dahal', description: 'A little about Pragyan Dahal, what he is exploring, and what he has not figured out yet.', render: aboutPage },
  '/projects': { title: 'Project notes · Pragyan Dahal', description: 'Experiments in marketplaces, local voice AI, and the lessons that came from building.', render: projectsPage },
  '/essays': { title: 'Essays · Pragyan Dahal', description: 'Working drafts on physical production, entrepreneurship, systems, and learning by building.', render: essaysPage },
  '/interests': { title: 'Interests · Pragyan Dahal', description: 'A live map of questions about physical systems, intelligence, companies, and markets.', render: interestsPage },
  '/now': { title: 'Now · Pragyan Dahal', description: 'What Pragyan Dahal is building and getting into right now.', render: nowPage }
}

export function getPage(path) {
  if (staticPages[path]) return staticPages[path]
  const essayMatch = path.match(/^\/essays\/([^/]+)$/)
  if (essayMatch) {
    const essay = essays.find(item => item.slug === essayMatch[1])
    if (essay) return { article: essay, title: `${essay.title} · Pragyan Dahal`, description: essay.description, render: () => detailPage(essay, 'essay') }
  }
  const projectMatch = path.match(/^\/projects\/([^/]+)$/)
  if (projectMatch) {
    const project = projects.find(item => item.slug === projectMatch[1])
    if (project) return { title: `${project.title} · Pragyan Dahal`, description: project.description, render: () => detailPage(project, 'project') }
  }
  return { notFound: true, title: 'Page not found · Pragyan Dahal', description: 'This page could not be found.', render: () => `<section class="not-found wrap"><span class="eyebrow">404 / Not found</span><h1>This page isn't here.</h1><a class="text-link" href="/">Back home <span>→</span></a></section>` }
}

export const routes = [...Object.keys(staticPages), ...essays.map(item => `/essays/${item.slug}`), ...projects.map(item => `/projects/${item.slug}`)]
export { essays, projects, escapeHtml }

export function renderDocument(template, path) {
  path = path.replace(/\/$/, '') || '/'
  const page = getPage(path)
  const url = `${siteUrl}${path}`
  const image = `${siteUrl}/og-image.png`
  const metadata = `
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}" />
    <meta property="og:title" content="${escapeHtml(page.title)}" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:type" content="${page.article ? 'article' : 'website'}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Pragyan Dahal · Writing and experiments on building in the physical world" />
    <meta name="twitter:title" content="${escapeHtml(page.title)}" />
    <meta name="twitter:description" content="${escapeHtml(page.description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    ${page.notFound ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${escapeHtml(url)}" />`}
    ${page.article ? `<meta property="article:published_time" content="${page.article.date}T12:00:00Z" /><meta property="article:author" content="Pragyan Dahal" />` : ''}`
  return template.replace('<!-- page metadata -->', metadata).replace('<div id="app"></div>', `<div id="app">${shell(page.render(), path)}</div>`)
}
