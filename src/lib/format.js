export function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')
}

export function readingTime(text) {
  const count = text.trim().split(/\s+/).length
  return `${Math.max(1, Math.ceil(count / 220))} min read`
}

export function formatDate(date) {
  if (!date) return ''
  return new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`))
}

