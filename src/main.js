import './style.css'

const revealElements = document.querySelectorAll('.reveal')

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible')
    })
  },
  { threshold: 0.14 }
)

revealElements.forEach(el => observer.observe(el))

const video = document.getElementById('heroVideo')
const videoFrame = document.querySelector('.video-frame')

if (video) {
  video.muted = true
  video.loop = true
  video.playsInline = true
  video.autoplay = true

  video.play().catch(() => {})
}

const updateVideoMotion = () => {
  if (!videoFrame) return

  const scrollY = window.scrollY
  const maxHeroScroll = window.innerHeight

  const progress = Math.min(Math.max(scrollY / maxHeroScroll, 0), 1)

  const translateY = progress * -28
  const scale = 1 + progress * 0.08

  videoFrame.style.transform = `translateY(${translateY}px) scale(${scale})`
}

window.addEventListener('scroll', updateVideoMotion, { passive: true })
window.addEventListener('resize', updateVideoMotion)
updateVideoMotion()