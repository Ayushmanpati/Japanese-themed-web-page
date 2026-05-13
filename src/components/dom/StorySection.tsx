import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function StorySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const textRefs = useRef<(HTMLParagraphElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      textRefs.current.forEach((text) => {
        if (!text) return
        
        gsap.fromTo(text, 
          { opacity: 0, y: 50 },
          {
            opacity: 1, 
            y: 0,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: text,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play reverse play reverse",
            }
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const stories = [
    "Like cherry blossoms in the spring...",
    "Some moments are fleeting, yet unforgettable.",
    "Today is a celebration of your light,",
    "and the warmth you bring into the world."
  ]

  return (
    <section ref={sectionRef} className="py-32 w-full min-h-[150vh] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative Scrapbook Images */}
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 0.15, x: -50 }}
        className="absolute top-20 left-0 w-64 h-64 pointer-events-none hidden lg:block"
      >
        <img src="/images/memories/memory-1.jpeg" className="w-full h-full object-cover rounded-lg rotate-[-12deg] grayscale hover:grayscale-0 transition-all duration-700" alt="" loading="lazy" decoding="async" />
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 0.1, x: 50 }}
        className="absolute bottom-40 right-0 w-80 h-80 pointer-events-none hidden lg:block"
      >
        <img src="/images/memories/memory-2.jpeg" className="w-full h-full object-cover rounded-lg rotate-[8deg] grayscale hover:grayscale-0 transition-all duration-700" alt="" loading="lazy" decoding="async" />
      </motion.div>

      <div className="max-w-3xl px-6 space-y-[30vh] md:space-y-[40vh] py-[20vh] relative z-10">
        {stories.map((story, idx) => (
          <p 
            key={idx}
            ref={(el) => { textRefs.current[idx] = el }}
            className="text-3xl md:text-5xl lg:text-6xl text-center text-warm-beige font-light leading-relaxed"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
          >
            {story}
          </p>
        ))}
      </div>
    </section>
  )
}
