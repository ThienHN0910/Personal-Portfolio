export function useSpotlight() {
  function handleSpotlightMove(e: MouseEvent) {
    const target = e.currentTarget as HTMLElement
    if (!target) return
    const rect = target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    target.style.setProperty('--mouse-x', `${x}px`)
    target.style.setProperty('--mouse-y', `${y}px`)
  }

  return {
    handleSpotlightMove,
  }
}
