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

let videoReady = false
let ticking = false

if (video) {
  video.pause()
  video.currentTime = 0
  video.removeAttribute('autoplay')
  video.removeAttribute('loop')
  video.autoplay = false
  video.loop = false
  video.muted = true
  video.playsInline = true
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function updateVideo() {
  ticking = false

  if (!video || !videoFrame || !videoReady || !video.duration) return

  const hero = document.querySelector('.hero')
  if (!hero) return

  const heroRect = hero.getBoundingClientRect()
  const heroHeight = hero.offsetHeight

  /*
    Progress is based only on the hero section.

    Top of page: 0
    End of hero: 1
  */
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

  // Force the video to never free-play.
  video.pause()
}

function requestUpdate() {
  if (!ticking) {
    ticking = true
    requestAnimationFrame(updateVideo)
  }
}

if (video) {
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