import gsap from 'gsap'

export interface TiltOptions {
  maxTilt?: number
  perspective?: number
  scale?: number
  speed?: number
  easing?: string
}

export function use3DTilt(options: TiltOptions = {}) {
  const {
    maxTilt = 5.5,
    perspective = 1000,
    scale = 1.015,
    speed = 0.35,
    easing = 'power2.out',
  } = options

  function handleTiltMove(e: MouseEvent) {
    const card = e.currentTarget as HTMLElement
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -maxTilt
    const rotateY = ((x - centerX) / centerX) * maxTilt

    gsap.to(card, {
      transform: `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
      duration: speed,
      ease: easing,
      overwrite: 'auto',
    })
  }

  function handleTiltLeave(e: MouseEvent) {
    const card = e.currentTarget as HTMLElement
    if (!card) return

    gsap.to(card, {
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      duration: 0.7,
      ease: 'elastic.out(1, 0.45)',
      overwrite: 'auto',
    })
  }

  return {
    handleTiltMove,
    handleTiltLeave,
  }
}
