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

if (video) {
  video.pause()

  const updateVideo = () => {
    if (!video.duration) return

    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight

    const progress = Math.min(
      Math.max(window.scrollY / scrollable, 0),
      1
    )

    video.currentTime = progress * video.duration
  }

  video.addEventListener('loadedmetadata', updateVideo)
  window.addEventListener('scroll', updateVideo)
}