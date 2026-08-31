import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useCounterAnimation() {
  function animateValue(
    target: HTMLElement,
    startVal: number,
    endVal: number,
    decimals = 0,
    prefix = '',
    suffix = '',
    duration = 1.6
  ) {
    if (!target) return

    const obj = { val: startVal }

    gsap.to(obj, {
      val: endVal,
      duration,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: target,
        start: 'top 90%',
        once: true,
      },
      onUpdate: () => {
        target.innerText = `${prefix}${obj.val.toFixed(decimals)}${suffix}`
      },
    })
  }

  return {
    animateValue,
  }
}
