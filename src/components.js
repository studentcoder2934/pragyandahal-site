import { Model } from './drawings.js'
import { escapeHtml, readingTime, formatDate } from './lib/format.js'

export function EssayCard(essay) {
  const href = `/essays/${essay.slug}`
  return `<article data-reveal class="essay-card">
    <div class="card-meta"><span>${essay.status === 'draft' ? 'Draft' : formatDate(essay.date)}</span><span>${readingTime(essay.body)}</span></div>
    <h3><a href="${href}">${escapeHtml(essay.title)} <span aria-hidden="true">↗</span></a></h3>
    <p>${escapeHtml(essay.description)}</p>
    <div class="tag-row">${essay.tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
  </article>`
}

export function ProjectCard(project, index) {
  return `<article class="project-card" data-reveal>
    <span class="project-index">${String(index + 1).padStart(2, '0')}</span>
    <div class="project-title"><span class="eyebrow">${escapeHtml(project.status)}</span><h3><a href="/projects/${project.slug}">${escapeHtml(project.title)}</a></h3>${['khaaloop', 'local-voice-ai'].includes(project.slug) ? Model(project.slug === 'khaaloop' ? 'marketplace' : 'voice', 'index', 'project-model') : ''}</div>
    <div class="project-summary"><p>${escapeHtml(project.description)}</p>${project.takeaway ? `<p class="project-lesson">${escapeHtml(project.takeaway)}</p>` : ''}
    <a class="text-link" href="/projects/${project.slug}">Read the project notes <span aria-hidden="true">↗</span></a></div>
  </article>`
}

export function SectionHeader(eyebrow, title, aside = '') {
  return `<div class="section-heading"><div><span class="eyebrow">${eyebrow}</span><h2>${title}</h2></div>${aside ? `<p>${aside}</p>` : ''}</div>`
}

export function Figure(content, caption, className = '') {
  return `<figure class="figure ${className}">${content}${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`
}

export function QuestionList(items) {
  return `<ol class="question-list">${items.map((q, i) => `<li data-reveal><span>${String(i + 1).padStart(2, '0')}</span><p>${q}</p></li>`).join('')}</ol>`
}

export function Callout(content) {
  return `<aside class="callout" role="note">${content}</aside>`
}

export function Prose(content) {
  return `<article class="prose article-prose">${content}</article>`
}
