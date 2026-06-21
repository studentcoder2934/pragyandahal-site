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

const isMobile = window.matchMedia('(max-width: 768px)').matches

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

if (video && isMobile) {
  video.muted = true
  video.loop = true
  video.autoplay = true
  video.playsInline = true
  video.setAttribute('playsinline', '')
  video.setAttribute('webkit-playsinline', '')

  video.play().catch(() => {})
}

if (video && !isMobile) {
  let videoReady = false
  let ticking = false

  video.pause()
  video.currentTime = 0
  video.removeAttribute('autoplay')
  video.removeAttribute('loop')
  video.autoplay = false
  video.loop = false
  video.muted = true
  video.playsInline = true

  function updateVideo() {
    ticking = false

    if (!video || !videoFrame || !videoReady || !video.duration) return

    const hero = document.querySelector('.hero')
    if (!hero) return

    const heroRect = hero.getBoundingClientRect()
    const heroHeight = hero.offsetHeight

    const progress = clamp(
      -heroRect.top / (heroHeight - window.innerHeight * 0.2),
      0,
      1
    )

    const targetTime = progress * video.duration

    if (Math.abs(video.currentTime - targetTime) > 0.03) {
      video.currentTime = targetTime
    }

    const translateY = progress * -28
    const scale = 1 + progress * 0.08

    videoFrame.style.transform = `translateY(${translateY}px) scale(${scale})`

    video.pause()
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(updateVideo)
    }
  }

  video.addEventListener('loadedmetadata', () => {
    videoReady = true
    video.pause()
    video.currentTime = 0
    updateVideo()
  })

  video.addEventListener('loadeddata', () => {
    videoReady = true
    video.pause()
    updateVideo()
  })

  video.addEventListener('play', () => {
    video.pause()
  })

  window.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('resize', requestUpdate)
  window.addEventListener('load', requestUpdate)

  requestUpdate()
}