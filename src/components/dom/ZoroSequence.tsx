import { useEffect, useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

interface ZoroSequenceProps {
  setZoroMode: (mode: boolean) => void
}

export default function ZoroSequence({ setZoroMode }: ZoroSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { amount: 0.6 }) // Trigger when 60% in view

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Fade out effect for the edges of the section
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  useEffect(() => {
    setZoroMode(isInView)
  }, [isInView, setZoroMode])

  return (
    <section ref={containerRef} className="relative w-full min-h-[200vh] flex items-center justify-center pointer-events-none">
      <motion.div 
        style={{ opacity }} 
        className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden"
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-1000" />
        
        {/* Zoro Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90 mix-blend-screen transition-opacity duration-1000"
          style={{ backgroundImage: 'url("/assets/zoro_bg.png")' }}
        />
        
        {/* Deep shadows to blend edges */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-transparent to-[#0a0d14]" />
      </motion.div>

      {/* Subtitles Container */}
      <div className="relative z-10 w-full h-[150vh] flex flex-col justify-around items-center py-[20vh]">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="text-3xl md:text-5xl font-serif italic text-cream-white tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
        >
          "Oi..."
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-serif italic text-cream-white tracking-wide drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
        >
          "Happy Birthday."
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="text-2xl md:text-4xl font-serif italic text-cream-white/80 tracking-wide drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
        >
          "Take care of yourself, alright?"
        </motion.p>
      </div>
    </section>
  )
}
