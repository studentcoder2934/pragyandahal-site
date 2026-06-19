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

  video.play().catch(() => {
    // Browser may block autoplay until interaction.
  })
}

const updateVideoMotion = () => {
  if (!videoFrame) return

  const rect = videoFrame.getBoundingClientRect()
  const windowHeight = window.innerHeight

  const progress = Math.min(
    Math.max((windowHeight - rect.top) / (windowHeight + rect.height), 0),
    1
  )

  const translateY = (progress - 0.5) * -36
  const scale = 1.04 + progress * 0.045
  const opacity = 0.84 + progress * 0.16

  videoFrame.style.transform = `translateY(${translateY}px) scale(${scale})`
  videoFrame.style.opacity = opacity
}

window.addEventListener('scroll', updateVideoMotion, { passive: true })
window.addEventListener('resize', updateVideoMotion)
updateVideoMotion()