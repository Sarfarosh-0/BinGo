/**
 * Generates lightweight sample waste item images on an offscreen canvas
 * for instant testing of the TensorFlow.js classifier on any device.
 */

function createCanvas(width = 300, height = 300) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

export async function createSampleWasteFile(type = 'bottle') {
  const canvas = createCanvas(300, 300)
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  // Clean studio background
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, 300, 300)

  // Soft studio shadow beneath object
  const shadowGrad = ctx.createRadialGradient(150, 245, 10, 150, 245, 80)
  shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.18)')
  shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = shadowGrad
  ctx.beginPath()
  ctx.ellipse(150, 245, 75, 16, 0, 0, Math.PI * 2)
  ctx.fill()

  if (type === 'bottle') {
    // Recyclable Plastic Bottle
    ctx.save()
    // Bottle neck & cap
    ctx.fillStyle = '#0284C7' // Blue cap
    ctx.beginPath()
    ctx.roundRect(138, 45, 24, 18, 4)
    ctx.fill()

    // Neck
    ctx.fillStyle = '#E0F2FE'
    ctx.fillRect(142, 63, 16, 20)

    // Body
    const bodyGrad = ctx.createLinearGradient(110, 0, 190, 0)
    bodyGrad.addColorStop(0, '#BAE6FD')
    bodyGrad.addColorStop(0.3, '#E0F2FE')
    bodyGrad.addColorStop(0.7, '#F0F9FF')
    bodyGrad.addColorStop(1, '#7DD3FC')

    ctx.fillStyle = bodyGrad
    ctx.beginPath()
    ctx.roundRect(115, 83, 70, 145, [14, 14, 18, 18])
    ctx.fill()

    // Label
    ctx.fillStyle = '#0284C7'
    ctx.fillRect(115, 130, 70, 45)
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 11px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('PURE WATER', 150, 152)
    ctx.font = '8px sans-serif'
    ctx.fillText('100% RECYCLABLE', 150, 164)

    // Highlights & Reflections
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(125, 95)
    ctx.lineTo(125, 215)
    ctx.stroke()
    ctx.restore()
  } else if (type === 'organic') {
    // Organic Banana Peel / Fruit Scrap
    ctx.save()
    ctx.lineWidth = 14
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // Banana peel skin (Yellow with brown specks)
    const peelGrad = ctx.createLinearGradient(80, 80, 220, 220)
    peelGrad.addColorStop(0, '#84CC16') // Green tip
    peelGrad.addColorStop(0.3, '#EAB308') // Golden yellow
    peelGrad.addColorStop(0.8, '#FACC15')
    peelGrad.addColorStop(1, '#A16207') // Brown stem

    ctx.strokeStyle = peelGrad
    ctx.beginPath()
    ctx.moveTo(85, 220)
    ctx.bezierCurveTo(110, 130, 190, 110, 215, 80)
    ctx.stroke()

    // Second flap
    ctx.beginPath()
    ctx.moveTo(85, 220)
    ctx.bezierCurveTo(140, 170, 180, 180, 225, 190)
    ctx.stroke()

    // Center pulpy flesh
    ctx.lineWidth = 8
    ctx.strokeStyle = '#FEF08A'
    ctx.beginPath()
    ctx.moveTo(100, 210)
    ctx.quadraticCurveTo(150, 145, 195, 105)
    ctx.stroke()

    // Natural brown spots
    ctx.fillStyle = '#713F12'
    const spots = [[130, 140, 3], [160, 120, 4], [145, 180, 3], [190, 175, 4]]
    spots.forEach(([x, y, r]) => {
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.restore()
  } else if (type === 'battery') {
    // Hazardous / E-Waste AA Battery
    ctx.save()
    // Positive terminal pip
    ctx.fillStyle = '#94A3B8'
    ctx.beginPath()
    ctx.roundRect(144, 45, 12, 12, 2)
    ctx.fill()

    // Upper gold/copper band
    const copperGrad = ctx.createLinearGradient(120, 0, 180, 0)
    copperGrad.addColorStop(0, '#B45309')
    copperGrad.addColorStop(0.4, '#F59E0B')
    copperGrad.addColorStop(0.7, '#D97706')
    copperGrad.addColorStop(1, '#92400E')

    ctx.fillStyle = copperGrad
    ctx.beginPath()
    ctx.roundRect(125, 57, 50, 50, [6, 6, 0, 0])
    ctx.fill()

    // Lower black body
    const blackGrad = ctx.createLinearGradient(120, 0, 180, 0)
    blackGrad.addColorStop(0, '#1E293B')
    blackGrad.addColorStop(0.4, '#334155')
    blackGrad.addColorStop(0.7, '#1E293B')
    blackGrad.addColorStop(1, '#0F172A')

    ctx.fillStyle = blackGrad
    ctx.beginPath()
    ctx.roundRect(125, 107, 50, 125, [0, 0, 6, 6])
    ctx.fill()

    // Battery markings
    ctx.fillStyle = '#F59E0B'
    ctx.font = 'bold 12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('+', 150, 78)

    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 10px sans-serif'
    ctx.fillText('1.5V AA', 150, 145)

    ctx.fillStyle = '#EF4444'
    ctx.font = 'bold 8px sans-serif'
    ctx.fillText('HAZARD', 150, 170)
    ctx.restore()
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(null)
        return
      }
      const file = new File([blob], `sample_${type}.jpg`, { type: 'image/jpeg' })
      resolve(file)
    }, 'image/jpeg', 0.9)
  })
}
