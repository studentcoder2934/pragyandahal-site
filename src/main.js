import './style.css'

const button = document.querySelector('.menu-toggle')
const nav = document.querySelector('.site-nav')
if (button && nav) {
  document.documentElement.classList.add('js')
  const close = () => {
    button.setAttribute('aria-expanded', 'false')
    button.querySelector('.sr-only').textContent = 'Open navigation'
    nav.classList.remove('is-open')
  }
  button.addEventListener('click', () => {
    const opening = button.getAttribute('aria-expanded') !== 'true'
    button.setAttribute('aria-expanded', String(opening))
    button.querySelector('.sr-only').textContent = opening ? 'Close navigation' : 'Open navigation'
    nav.classList.toggle('is-open', opening)
  })
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      close()
      button.focus()
    }
  })
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) close()
  })
  window.matchMedia('(min-width: 701px)').addEventListener('change', event => {
    if (event.matches) close()
  })
}

const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
if (!motion.matches && 'IntersectionObserver' in window) {
  // Stagger small groups, keeping paragraphs and reading order untouched.
  document.querySelectorAll('.essay-grid, .project-grid, .question-list').forEach(group => {
    [...group.children].forEach((child, index) => {
      child.style.setProperty('--reveal-delay', `${Math.min(index, 3) * 85}ms`)
    })
  })
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.remove('awaiting-reveal')
        observer.unobserve(entry.target)
      }
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' })
  document.querySelectorAll('[data-reveal]').forEach(element => {
    if (element.getBoundingClientRect().top > window.innerHeight) {
      element.classList.add('awaiting-reveal')
      observer.observe(element)
    }
  })

  const modelObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('model-in-view')
        modelObserver.unobserve(entry.target)
      }
    }
  }, { threshold: 0.18 })
  document.querySelectorAll('[data-model]').forEach(model => {
    model.classList.add('model-armed')
    modelObserver.observe(model)
  })

  // Small changes to the exploded model's spacing follow the actual scroll.
  const hero = document.querySelector('.hero')
  const drawing = document.querySelector('.hero-figure')
  let pendingFrame = false
  const updateHero = () => {
    pendingFrame = false
    if (!hero || !drawing || motion.matches) return
    const box = hero.getBoundingClientRect()
    const progress = Math.max(0, Math.min(1, -box.top / box.height))
    drawing.style.setProperty('--roof-offset', `${progress * -34}px`)
    drawing.style.setProperty('--base-offset', `${progress * 12}px`)
  }
  const onScroll = () => {
    if (!pendingFrame) {
      pendingFrame = true
      window.requestAnimationFrame(updateHero)
    }
  }
  if (hero && drawing) window.addEventListener('scroll', onScroll, { passive: true })
  motion.addEventListener('change', event => {
    if (event.matches) {
      document.querySelectorAll('.awaiting-reveal').forEach(element => element.classList.remove('awaiting-reveal'))
      document.querySelectorAll('.model-armed').forEach(element => element.classList.remove('model-armed', 'model-in-view'))
      observer.disconnect()
      modelObserver.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  })
}
