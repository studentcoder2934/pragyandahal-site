import './style.css'

const canvas = document.querySelector('#grain')

if (canvas) {
  const ctx = canvas.getContext('2d')

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  function drawGrain() {
    const imageData = ctx.createImageData(canvas.width, canvas.height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const value = Math.random() * 255
      data[i] = value
      data[i + 1] = value
      data[i + 2] = value
      data[i + 3] = 22
    }

    ctx.putImageData(imageData, 0, 0)
  }

  resize()
  drawGrain()
  setInterval(drawGrain, 90)
  window.addEventListener('resize', resize)
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible')
  })
})

document.querySelectorAll('section, article').forEach(el => {
  el.style.opacity = 0
  el.style.transform = 'translateY(24px)'
  el.style.transition = 'opacity 0.8s ease, transform 0.8s ease'
  observer.observe(el)
})

const style = document.createElement('style')
style.textContent = `
  .visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`
document.head.appendChild(style)