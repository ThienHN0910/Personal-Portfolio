import { onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface RevealOptions {
  y?: number
  x?: number
  opacity?: number
  scale?: number
  rotateX?: number
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
      rotateX = 0,
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
      rotateX,
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

  /**
   * Auto-initializes AOS-like attributes: data-aos="fade-up|fade-left|fade-right|zoom-in|flip-up"
   */
  function initAosReveals(root: HTMLElement | Document = document) {
    if (typeof window === 'undefined') return
    const elements = root.querySelectorAll<HTMLElement>('[data-aos]')

    elements.forEach((el) => {
      const type = el.getAttribute('data-aos') || 'fade-up'
      const delay = parseFloat(el.getAttribute('data-aos-delay') || '0') / 1000
      const duration = parseFloat(el.getAttribute('data-aos-duration') || '750') / 1000
      const offset = el.getAttribute('data-aos-offset') || '88%'

      let initialProps: gsap.TweenVars = {
        opacity: 0,
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: `top ${offset}`,
          once: true,
        },
      }

      switch (type) {
        case 'fade-up':
          initialProps = { ...initialProps, y: 36, scale: 0.99 }
          break
        case 'fade-down':
          initialProps = { ...initialProps, y: -36, scale: 0.99 }
          break
        case 'fade-left':
          initialProps = { ...initialProps, x: -40, scale: 0.99 }
          break
        case 'fade-right':
          initialProps = { ...initialProps, x: 40, scale: 0.99 }
          break
        case 'zoom-in':
          initialProps = { ...initialProps, scale: 0.92, y: 15 }
          break
        case 'flip-up':
          initialProps = {
            ...initialProps,
            transformPerspective: 1000,
            rotateX: 18,
            y: 30,
            scale: 0.97,
          }
          break
        default:
          initialProps = { ...initialProps, y: 30 }
      }

      const tween = gsap.from(el, initialProps)
      if (tween.scrollTrigger) {
        triggers.value.push(tween.scrollTrigger)
      }
    })
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
    initAosReveals,
    cleanup,
  }
}
