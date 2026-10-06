// Conceptual drawings, not product screenshots or measured engineering diagrams.
const captions = {
  assembly: ['Modular assembly', 'Repeated floor panels above a site. The layers arrive in sequence as the model enters view.'],
  voice: ['Speech, text chunks, and audio', 'A conceptual drawing of speech passing through text chunks to audio, with the stages of the local voice pipeline below.'],
  marketplace: ['Surplus-food reservation flow', 'A merchant listing connects to a reservation and then a pickup. The drawing represents the intended transaction, not a record of completed sales.'],
  replication: ['Digital copies and physical production', 'One software source branches into three copies. Physical production needs material and assembly for each additional structure.'],
}

function panel(x, y, width, depth, height, phase = 0) {
  return `<g class="model-layer" style="--phase:${phase}">
    <path class="model-top" d="M${x} ${y}l${width} -${depth} ${width} ${depth} -${width} ${depth}Z"/>
    <path class="model-face" d="M${x} ${y}v${height}l${width} ${depth}v-${height}Z"/>
    <path class="model-side" d="M${x + width} ${y + depth}l${width} -${depth}v${height}l-${width} ${depth}Z"/>
    <path class="trace" pathLength="1" d="M${x} ${y}l${width} -${depth} ${width} ${depth} -${width} ${depth}ZM${x + width} ${y + depth}v${height}"/>
  </g>`
}

function assembly() {
  return `<g class="model-site"><path class="model-ground" d="M35 268l135 -72 135 72 -135 72Z"/><path class="fine-line" d="M80 244l135 72M125 220l135 72M80 292l135 -72M125 316l135 -72"/></g>
    <g class="guide-lines"><path d="M90 79V284M170 119V326M250 79V284M170 39V241"/></g>
    <g class="assembly-supports"><path class="trace" pathLength="1" d="M95 235V127M170 278V169M245 235V127M170 198V91"/></g>
    ${panel(90, 247, 80, 42, 10, 0)}
    ${panel(90, 192, 80, 42, 7, 1)}
    ${panel(90, 135, 80, 42, 7, 2)}
    ${panel(90, 78, 80, 42, 7, 3)}
    <g class="assembly-seams fine-line"><path d="M116 65l80 42M143 50l80 42M116 122l80 42M143 107l80 42M116 179l80 42M143 164l80 42"/></g>
    <g class="model-labels"><path d="M252 83H308M252 192H308M252 269H308"/><text x="269" y="75">PANELS</text><text x="254" y="184">ASSEMBLY</text><text x="285" y="261">SITE</text></g>`
}

function waveform(start, mid, heights, phase) {
  return `<g class="model-wave" style="--phase:${phase}">${heights.map((height, i) => `<path d="M${start + i * 5} ${mid - height / 2}v${height}"/>`).join('')}</g>`
}

function voice() {
  return `<g class="model-labels"><text x="24" y="28">SPEECH</text><text x="153" y="28">TEXT CHUNKS</text><text x="301" y="28">AUDIO</text></g>
    <g class="guide-lines"><path d="M20 92H382M115 40V148M280 40V148"/></g>
    ${waveform(25, 92, [5, 12, 24, 42, 63, 35, 16, 48, 68, 49, 24, 8, 18, 5], 0)}
    <g class="model-layer" style="--phase:1"><path class="model-top" d="M152 60l75 -20 19 11 -75 20Z"/><path class="fine-line" d="M166 58l51 -14"/>
    <path class="model-top" d="M152 88l75 -20 19 11 -75 20Z"/><path class="fine-line" d="M166 86l38 -10"/>
    <path class="model-top" d="M152 116l75 -20 19 11 -75 20Z"/><path class="fine-line" d="M166 114l47 -12"/></g>
    <g class="trace" style="--phase:2"><path pathLength="1" d="M101 92H141M255 92H294"/><path d="M135 88l6 4 -6 4M288 88l6 4 -6 4"/></g>
    ${waveform(302, 92, [9, 18, 33, 54, 65, 50, 29, 40, 55, 45, 27, 15, 8, 4], 3)}
    <g class="model-timeline"><path class="trace" pathLength="1" d="M28 178H371"/>
      ${['Turn', 'STT', 'Model', 'Text', 'TTS', 'Playback'].map((label, i) => `<circle cx="${28 + i * 68.6}" cy="178" r="3"/><text x="${28 + i * 68.6}" y="201" text-anchor="middle">${label}</text>`).join('')}
      <circle class="signal-dot" cx="28" cy="178" r="4"/>
    </g>`
}

function marketplace() {
  return `<g class="model-labels"><text x="32" y="26">LISTING</text><text x="154" y="26">RESERVATION</text><text x="294" y="26">PICKUP</text></g>
    <g class="guide-lines"><path d="M15 156l111 -62 115 61 126 -68"/></g>
    <g class="model-layer" style="--phase:0"><path class="model-top" d="M24 81l65 -35 37 20 -65 35Z"/><path class="model-face" d="M24 81v56l37 20v-56Z"/><path class="model-side" d="M61 101l65 -35v56l-65 35Z"/>
      <path class="trace" pathLength="1" d="M34 83l47 -25M70 113l38 -20M70 127l27 -15M70 140l38 -20"/></g>
    <g class="model-layer" style="--phase:1"><path class="model-top" d="M162 79l45 -25 33 18 -45 25Z"/><path class="model-face" d="M162 79v66l33 18V97Z"/><path class="model-side" d="M195 97l45 -25v66l-45 25Z"/>
      <path class="trace" pathLength="1" d="M202 104l26 -14M202 116l19 -10M206 139l5 3 13 -21"/></g>
    <g class="model-layer" style="--phase:2"><path class="model-top" d="M294 112l40 -22 39 21 -39 22Z"/><path class="model-face" d="M294 112v32l40 22v-33Z"/><path class="model-side" d="M334 133l39 -22v31l-39 24Z"/>
      <path class="trace" pathLength="1" d="M310 105l39 21M310 105v11l39 21v-11"/></g>
    <g class="trace" style="--phase:3"><path pathLength="1" d="M113 159l19 10 25 -14M242 162l19 10 24 -13"/><path d="M149 153l8 2 -2 7M277 157l8 2 -2 7"/></g>`
}

function replication() {
  return `<g class="model-labels"><text x="22" y="28">SOFTWARE</text><text x="22" y="191">PHYSICAL PRODUCTION</text></g>
    <g class="trace"><path pathLength="1" d="M58 104H141M141 104l75 -43M141 104H216M141 104l75 43M216 61H360M216 104H360M216 147H360"/></g>
    <g class="source-nodes"><circle cx="58" cy="104" r="7"/><circle cx="141" cy="104" r="3"/>${[61, 104, 147].map((y, i) => `<g class="model-layer" style="--phase:${i}"><rect x="252" y="${y - 15}" width="101" height="29"/><text x="269" y="${y + 4}">COPY ${i + 1}</text></g>`).join('')}</g>
    <g class="trace" style="--phase:1"><path pathLength="1" d="M45 255H354"/></g>
    ${[38, 158, 278].map((x, i) => panel(x, 250, 27, 15, 30, i + 1)).join('')}
    <g class="model-labels"><text x="36" y="309">MATERIAL</text><text x="145" y="309">ASSEMBLY</text><text x="281" y="309">REPEAT</text></g>`
}

export function Model(kind, instance = 'main', className = '') {
  const drawings = { assembly, voice, marketplace, replication }
  const [title, description] = captions[kind]
  const key = `${kind}-${instance}`
  const height = kind === 'voice' ? 222 : kind === 'marketplace' ? 200 : 350
  const width = kind === 'assembly' ? 340 : 400
  return `<div class="visual-model ${className}" data-model>
    <svg class="model-svg model-${kind}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="${key}-title ${key}-description">
      <title id="${key}-title">${title}</title><desc id="${key}-description">${description}</desc>
      ${drawings[kind]()}
    </svg>
  </div>`
}
