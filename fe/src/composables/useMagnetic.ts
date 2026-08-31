import gsap from 'gsap'

export function useMagnetic() {
  function handleMagneticMove(e: MouseEvent, strength = 0.25) {
    const target = e.currentTarget as HTMLElement
    if (!target) return
    const rect = target.getBoundingClientRect()
    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)

    gsap.to(target, {
      x: x * strength,
      y: y * strength,
      duration: 0.25,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }

  function handleMagneticLeave(e: MouseEvent) {
    const target = e.currentTarget as HTMLElement
    if (!target) return
    gsap.to(target, {
      x: 0,
      y: 0,
      duration: 0.65,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto',
    })
  }

  return {
    handleMagneticMove,
    handleMagneticLeave,
  }
}
