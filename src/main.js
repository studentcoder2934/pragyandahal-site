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
  video.pause()
  video.currentTime = 0
}

const updateVideoOnScroll = () => {
  if (!video || !video.duration || !videoFrame) return

  const heroScrollLength = window.innerHeight * 1.25
  const progress = Math.min(Math.max(window.scrollY / heroScrollLength, 0), 1)

  video.currentTime = progress * video.duration

  const translateY = progress * -28
  const scale = 1 + progress * 0.08

  videoFrame.style.transform = `translateY(${translateY}px) scale(${scale})`
}

if (video) {
  video.addEventListener('loadedmetadata', updateVideoOnScroll)
  window.addEventListener('scroll', updateVideoOnScroll, { passive: true })
  window.addEventListener('resize', updateVideoOnScroll)
  updateVideoOnScroll()
}