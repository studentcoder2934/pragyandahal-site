import './style.css'
import * as THREE from 'three'

const canvas = document.querySelector('#wpt-canvas')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
)

camera.position.set(0, 1.6, 8)

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
})

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const group = new THREE.Group()
scene.add(group)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.55)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0x9ffcff, 4, 40)
pointLight.position.set(4, 5, 6)
scene.add(pointLight)

const backLight = new THREE.PointLight(0x4de7ff, 2, 30)
backLight.position.set(-5, -3, -4)
scene.add(backLight)

const materials = {
  teal: new THREE.MeshStandardMaterial({
    color: 0x7ffcff,
    emissive: 0x0b8a99,
    emissiveIntensity: 0.35,
    metalness: 0.55,
    roughness: 0.25,
  }),

  glass: new THREE.MeshPhysicalMaterial({
    color: 0x9ffcff,
    transmission: 0.45,
    opacity: 0.55,
    transparent: true,
    metalness: 0.2,
    roughness: 0.08,
    clearcoat: 1,
  }),

  darkMetal: new THREE.MeshStandardMaterial({
    color: 0x071316,
    metalness: 0.85,
    roughness: 0.3,
  }),

  panel: new THREE.MeshStandardMaterial({
    color: 0x071a1f,
    emissive: 0x103a42,
    emissiveIntensity: 0.18,
    metalness: 0.5,
    roughness: 0.22,
  }),

  beam: new THREE.MeshBasicMaterial({
    color: 0x7ffcff,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
  }),
}

// Earth / receiver base
const receiverGeometry = new THREE.CylinderGeometry(2.2, 2.2, 0.06, 96)
const receiver = new THREE.Mesh(receiverGeometry, materials.darkMetal)
receiver.position.set(0, -1.7, 0)
receiver.rotation.x = Math.PI / 2
group.add(receiver)

// Rectenna grid
const grid = new THREE.GridHelper(4.2, 28, 0x7ffcff, 0x0a5964)
grid.position.set(0, -1.63, 0)
grid.rotation.x = Math.PI / 2
group.add(grid)

// Receiver glow ring
const ringGeometry = new THREE.TorusGeometry(2.25, 0.018, 16, 128)
const receiverRing = new THREE.Mesh(ringGeometry, materials.teal)
receiverRing.position.set(0, -1.58, 0)
receiverRing.rotation.x = Math.PI / 2
group.add(receiverRing)

// Orbital transmitter array
const transmitter = new THREE.Group()
transmitter.position.set(0, 1.9, 0)
group.add(transmitter)

const panelGeometry = new THREE.BoxGeometry(0.72, 0.06, 0.5)

for (let x = -2; x <= 2; x++) {
  for (let z = -1; z <= 1; z++) {
    const panel = new THREE.Mesh(panelGeometry, materials.panel)
    panel.position.set(x * 0.82, 0, z * 0.58)
    transmitter.add(panel)

    const panelEdge = new THREE.EdgesGeometry(panelGeometry)
    const line = new THREE.LineSegments(
      panelEdge,
      new THREE.LineBasicMaterial({
        color: 0x7ffcff,
        transparent: true,
        opacity: 0.25,
      })
    )
    line.position.copy(panel.position)
    transmitter.add(line)
  }
}

// Transmitter dish / phased array center
const dish = new THREE.Mesh(
  new THREE.TorusGeometry(0.72, 0.035, 20, 120),
  materials.teal
)
dish.rotation.x = Math.PI / 2
dish.position.set(0, -0.08, 0)
transmitter.add(dish)

const core = new THREE.Mesh(
  new THREE.SphereGeometry(0.16, 32, 32),
  materials.glass
)
core.position.set(0, -0.08, 0)
transmitter.add(core)

// Microwave beam cone
const beamGeometry = new THREE.ConeGeometry(1.65, 3.35, 96, 1, true)
const beam = new THREE.Mesh(beamGeometry, materials.beam)
beam.position.set(0, 0.08, 0)
beam.rotation.x = Math.PI
group.add(beam)

// Beam rings
const beamRings = new THREE.Group()
group.add(beamRings)

for (let i = 0; i < 7; i++) {
  const radius = 0.18 + i * 0.22
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(radius, 0.006, 8, 90),
    new THREE.MeshBasicMaterial({
      color: 0x7ffcff,
      transparent: true,
      opacity: 0.22 - i * 0.018,
    })
  )

  ring.position.y = 1.6 - i * 0.45
  ring.rotation.x = Math.PI / 2
  beamRings.add(ring)
}

// Particles traveling through beam
const particles = []
const particleGeometry = new THREE.SphereGeometry(0.025, 12, 12)

for (let i = 0; i < 70; i++) {
  const particle = new THREE.Mesh(
    particleGeometry,
    new THREE.MeshBasicMaterial({
      color: 0x9ffcff,
      transparent: true,
      opacity: 0.7,
    })
  )

  const t = Math.random()
  particle.userData = {
    t,
    speed: 0.002 + Math.random() * 0.003,
    angle: Math.random() * Math.PI * 2,
    radius: Math.random() * 0.75,
  }

  particles.push(particle)
  group.add(particle)
}

// Background star field
const starsGeometry = new THREE.BufferGeometry()
const starCount = 700
const starPositions = new Float32Array(starCount * 3)

for (let i = 0; i < starCount; i++) {
  starPositions[i * 3] = (Math.random() - 0.5) * 24
  starPositions[i * 3 + 1] = (Math.random() - 0.5) * 14
  starPositions[i * 3 + 2] = (Math.random() - 0.5) * 16
}

starsGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(starPositions, 3)
)

const stars = new THREE.Points(
  starsGeometry,
  new THREE.PointsMaterial({
    color: 0x7ffcff,
    size: 0.012,
    transparent: true,
    opacity: 0.42,
  })
)

scene.add(stars)

function getScrollProgress() {
  const scrollTop = window.scrollY
  const maxScroll = document.body.scrollHeight - window.innerHeight
  return maxScroll <= 0 ? 0 : scrollTop / maxScroll
}

function animate() {
  requestAnimationFrame(animate)

  const time = performance.now() * 0.001
  const scroll = getScrollProgress()

  group.rotation.y = time * 0.08 + scroll * 1.15
  group.rotation.x = -0.1 + scroll * 0.35

  transmitter.rotation.y = Math.sin(time * 0.55) * 0.15
  transmitter.rotation.z = Math.sin(time * 0.35) * 0.04

  receiverRing.scale.setScalar(1 + Math.sin(time * 2.3) * 0.012)
  core.scale.setScalar(1 + Math.sin(time * 3.2) * 0.16)

  beam.material.opacity = 0.18 + Math.sin(time * 1.7) * 0.055 + scroll * 0.08

  beamRings.children.forEach((ring, index) => {
    ring.scale.setScalar(1 + Math.sin(time * 1.6 + index) * 0.035)
    ring.material.opacity = 0.12 + Math.sin(time * 2 + index) * 0.035
  })

  particles.forEach((particle) => {
    particle.userData.t -= particle.userData.speed

    if (particle.userData.t < 0) {
      particle.userData.t = 1
    }

    const t = particle.userData.t
    const y = -1.45 + t * 3.25
    const radius = particle.userData.radius * (0.25 + (1 - t) * 1.25)
    const angle = particle.userData.angle + time * 0.9

    particle.position.x = Math.cos(angle) * radius
    particle.position.y = y
    particle.position.z = Math.sin(angle) * radius
  })

  stars.rotation.y = time * 0.018
  stars.rotation.x = scroll * 0.18

  camera.position.x = Math.sin(scroll * Math.PI) * 0.7
  camera.position.y = 1.6 - scroll * 0.55
  camera.position.z = 8 - scroll * 1.6
  camera.lookAt(0, 0, 0)

  renderer.render(scene, camera)
}

animate()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Reveal animations
const revealElements = document.querySelectorAll('.reveal')

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  },
  {
    threshold: 0.15,
  }
)

revealElements.forEach((element) => observer.observe(element))