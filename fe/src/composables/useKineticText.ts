import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface KineticTextOptions {
  duration?: number
  stagger?: number
  ease?: string
  delay?: number
  start?: string
  yPercent?: number
}

export function useKineticText() {
  /**
   * Splits element text into masked words and animates them on scroll
   */
  function revealText(
    element: HTMLElement | null,
    options: KineticTextOptions = {}
  ) {
    if (!element || typeof window === 'undefined') return

    const {
      duration = 0.9,
      stagger = 0.045,
      ease = 'power4.out',
      delay = 0,
      start = 'top 85%',
      yPercent = 110,
    } = options

    const text = element.innerText.trim()
    const words = text.split(/\s+/)

    element.innerHTML = words
      .map(
        (w) =>
          `<span class="inline-block overflow-hidden pb-1 -mb-1 align-top"><span class="kinetic-word inline-block will-change-transform">${w}</span></span>`
      )
      .join(' ')

    const wordSpans = element.querySelectorAll('.kinetic-word')

    return gsap.fromTo(
      wordSpans,
      { yPercent, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration,
        stagger,
        ease,
        delay,
        scrollTrigger: {
          trigger: element,
          start,
          once: true,
        },
      }
    )
  }

  return {
    revealText,
  }
}
