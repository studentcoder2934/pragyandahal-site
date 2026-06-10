import './style.css'

const cursorGlow = document.querySelector('.cursor-glow')

window.addEventListener('mousemove', event => {
  if (!cursorGlow) return

  cursorGlow.style.left = `${event.clientX}px`
  cursorGlow.style.top = `${event.clientY}px`
})

const revealElements = document.querySelectorAll('.reveal')

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  },
  {
    threshold: 0.15,
  }
)

revealElements.forEach(element => observer.observe(element))