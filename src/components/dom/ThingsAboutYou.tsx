import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const traits = [
  "The way you care about people.",
  "Your comforting presence.",
  "Your smile when you're genuinely happy.",
  "The softness you bring into people's lives.",
]

export default function ThingsAboutYou() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <section ref={containerRef} className="py-32 w-full min-h-[120vh] relative flex flex-col items-center justify-center overflow-hidden">
      
      <motion.div style={{ y }} className="text-center mb-24 md:mb-32 relative z-10">
        <span className="text-sakura-pink font-mono text-sm tracking-[0.5em] uppercase opacity-70 block mb-4">
          Chapter V
        </span>
        <h2 className="text-4xl md:text-6xl font-light text-cream-white tracking-wide mb-8 drop-shadow-lg">
          Things About You
        </h2>
        <div className="w-24 h-[1px] bg-warm-beige/30 mx-auto" />
      </motion.div>

      <div className="w-full max-w-5xl px-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
        {traits.map((trait, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
            className={`w-full flex ${index % 2 === 0 ? 'justify-start' : 'justify-end md:mt-24'}`}
          >
            {/* Floating Container */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ 
                duration: 6 + (index % 2), 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: index * 0.5
              }}
              className="w-full max-w-[400px]"
            >
              {/* Card Surface */}
              <motion.div
                whileHover={{ scale: 1.03, rotate: index % 2 === 0 ? 1 : -1 }}
                className="glass p-10 md:p-14 rounded-3xl flex items-center justify-center text-center shadow-[0_20px_60px_rgba(247,198,208,0.05)] border border-warm-beige/10 hover:border-sakura-pink/30 bg-cream-white/5 hover:bg-sakura-pink/5 transition-all duration-700 cursor-default relative overflow-hidden group aspect-square md:aspect-auto md:min-h-[350px]"
              >
                {/* Internal Glow on Hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-sakura-pink/10 via-transparent to-warm-beige/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                <p className="text-2xl md:text-4xl font-serif italic text-warm-beige font-light leading-relaxed drop-shadow-xl relative z-10 group-hover:text-cream-white transition-colors duration-700">
                  "{trait}"
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
