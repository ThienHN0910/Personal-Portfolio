import { onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface RevealOptions {
  y?: number
  x?: number
  opacity?: number
  scale?: number
  duration?: number
  stagger?: number
  ease?: string
  delay?: number
  start?: string
  once?: boolean
}

export function useScrollReveal() {
  const triggers = ref<ScrollTrigger[]>([])

  function reveal(
    target: string | HTMLElement | HTMLElement[] | NodeListOf<Element> | HTMLCollection | ArrayLike<Element>,
    options: RevealOptions = {}
  ) {
    if (typeof window === 'undefined') return

    const {
      y = 30,
      x = 0,
      opacity = 0,
      scale = 0.98,
      duration = 0.75,
      stagger = 0.08,
      ease = 'power3.out',
      delay = 0,
      start = 'top 88%',
      once = true,
    } = options

    const animation = gsap.from(target, {
      y,
      x,
      opacity,
      scale,
      duration,
      stagger,
      ease,
      delay,
      scrollTrigger: {
        trigger: target as any,
        start,
        once,
        onEnter: () => {
          ScrollTrigger.refresh()
        },
      },
    })

    if (animation.scrollTrigger) {
      triggers.value.push(animation.scrollTrigger)
    }

    return animation
  }

  function cleanup() {
    triggers.value.forEach((t) => t.kill())
    triggers.value = []
  }

  onUnmounted(() => {
    cleanup()
  })

  return {
    reveal,
    cleanup,
  }
}
