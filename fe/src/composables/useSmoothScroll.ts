import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance: Lenis | null = null

export function useSmoothScroll() {
  function initSmoothScroll() {
    if (typeof window === 'undefined' || lenisInstance) return lenisInstance

    lenisInstance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.2,
      infinite: false,
    })

    // Synchronize Lenis scroll with GSAP ScrollTrigger
    lenisInstance.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenisInstance?.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return lenisInstance
  }

  function destroySmoothScroll() {
    if (lenisInstance) {
      lenisInstance.destroy()
      lenisInstance = null
    }
  }

  function scrollTo(target: string | number | HTMLElement, options?: { offset?: number; immediate?: boolean; duration?: number }) {
    lenisInstance?.scrollTo(target, options)
  }

  return {
    initSmoothScroll,
    destroySmoothScroll,
    scrollTo,
    getLenis: () => lenisInstance,
  }
}
