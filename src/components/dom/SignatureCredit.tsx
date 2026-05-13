import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function SignatureCredit() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Cinematic fade in and fade out
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 1, 1, 0])
  const yOffset = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <section ref={containerRef} className="h-[150vh] relative w-full flex items-center justify-center bg-black overflow-hidden">
      {/* Cinematic Grain Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-screen" style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png")' }} />
      
      {/* Subtle fading lanterns / ambient light in the background */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-sakura-pink/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-warm-beige/5 rounded-full blur-[120px]" />
      
      {/* Drifting soft ambient particles */}
      <motion.div 
        animate={{ y: [0, -30, 0], x: [0, 20, 0], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/3 w-3 h-3 bg-sakura-pink/20 rounded-full blur-[2px]"
      />
      <motion.div 
        animate={{ y: [0, 30, 0], x: [0, -15, 0], opacity: [0.05, 0.2, 0.05] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-2/3 right-1/3 w-4 h-4 bg-warm-beige/20 rounded-full blur-[3px]"
      />
      <motion.div 
        animate={{ y: [0, -40, 0], x: [0, -20, 0], opacity: [0.05, 0.25, 0.05] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute top-1/2 right-1/4 w-2 h-2 bg-cream-white/20 rounded-full blur-[1px]"
      />

      {/* Typography Layer */}
      <motion.div 
        style={{ opacity, y: yOffset }}
        className="text-center z-10 flex flex-col items-center px-6"
      >
        <p className="text-white/60 font-serif text-sm md:text-base leading-loose tracking-[0.2em] drop-shadow-lg mb-8">
          “directed, written,<br />
          and emotionally damaged<br />
          by the greatest of all.”
        </p>
        
        <div className="w-8 h-[1px] bg-white/20 mb-8" />
        
        <p className="text-white/30 font-mono text-xs tracking-[0.5em] uppercase drop-shadow-sm">
          — H4LCYN
        </p>
      </motion.div>
    </section>
  )
}
