// Set SITE_URL to the public origin when deploying. No domain is assumed.
export const siteUrl = (process.env.SITE_URL || 'http://localhost:5173').replace(/\/$/, '')
export const contact = { email: 'pragyandahal02@gmail.com' }
