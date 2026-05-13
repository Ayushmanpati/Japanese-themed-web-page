import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface CinematicQuoteProps {
  japaneseText: string;
  englishText: string;
  romajiText?: string;
  theme?: 'light' | 'dark' | 'bloom';
}

const Petals = ({ theme }: { theme: 'light' | 'dark' | 'bloom' }) => {
  const petalCount = theme === 'bloom' ? 12 : theme === 'dark' ? 5 : 8;
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(petalCount)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            y: theme === 'bloom' ? "110%" : "-10%", 
            x: `${Math.random() * 100}%`,
            opacity: 0,
            rotate: 0,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            y: theme === 'bloom' ? "-10%" : "110%", 
            x: `${Math.random() * 100}%`,
            opacity: [0, 0.6, 0],
            rotate: theme === 'bloom' ? -360 : 360,
          }}
          transition={{ 
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10
          }}
          className={`absolute w-3 h-3 md:w-4 md:h-4 rounded-bl-[50%] rounded-tr-[50%] blur-[1px] ${
            theme === 'dark' ? 'bg-sakura-pink/20' : 
            theme === 'bloom' ? 'bg-white/40 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 
            'bg-sakura-pink/40'
          }`}
        />
      ))}
    </div>
  )
}

export default function CinematicQuote({ japaneseText, englishText, romajiText, theme = 'light' }: CinematicQuoteProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Soft parallax effect for the text container
  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 1, 1, 0])

  let containerClass = "min-h-[60vh] flex flex-col items-center justify-center relative overflow-hidden my-16 md:my-32"
  let japaneseClass = "text-2xl md:text-5xl lg:text-6xl font-japanese font-light tracking-[0.2em] text-sakura-pink mb-8 drop-shadow-md"
  let englishClass = "text-2xl md:text-4xl font-handwritten text-warm-beige/90"
  let romajiClass = "text-xs md:text-sm font-mono text-warm-beige/40 tracking-[0.4em] mt-6 uppercase"

  if (theme === 'dark') {
    japaneseClass = "text-2xl md:text-5xl lg:text-6xl font-japanese font-light tracking-[0.2em] text-cream-white mb-8 drop-shadow-xl"
    englishClass = "text-2xl md:text-4xl font-handwritten text-sakura-pink/80"
    romajiClass = "text-xs md:text-sm font-mono text-sakura-pink/30 tracking-[0.4em] mt-6 uppercase"
  } else if (theme === 'bloom') {
    japaneseClass = "text-3xl md:text-6xl lg:text-7xl font-japanese font-light tracking-[0.2em] text-white mb-8 drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]"
    englishClass = "text-3xl md:text-5xl font-handwritten text-cream-white drop-shadow-md"
    romajiClass = "text-xs md:text-sm font-mono text-white/50 tracking-[0.4em] mt-6 uppercase"
  }

  return (
    <motion.section 
      ref={containerRef} 
      className={containerClass}
      onViewportEnter={() => window.dispatchEvent(new CustomEvent('music-quote-enter'))}
      onViewportLeave={() => window.dispatchEvent(new CustomEvent('music-quote-leave'))}
      viewport={{ margin: "-20%" }}
    >
      {/* Ambient background glow */}
      <div className={`absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${
        theme === 'dark' ? 'from-midnight-blue/80' : 
        theme === 'bloom' ? 'from-sakura-pink/10' : 
        'from-sakura-pink/5'
      } to-transparent opacity-60`} />
      
      <Petals theme={theme} />
      
      <motion.div 
        style={{ y, opacity }}
        className="z-10 text-center flex flex-col items-center px-6 max-w-4xl mx-auto"
      >
        <motion.h3 
          initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 2, ease: "easeOut" }}
          className={japaneseClass}
        >
          {japaneseText}
        </motion.h3>
        
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 2, delay: 0.8, ease: "easeOut" }}
          className={englishClass}
        >
          {englishText}
        </motion.p>
        
        {romajiText && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 2, delay: 1.4, ease: "easeOut" }}
            className={romajiClass}
          >
            {romajiText}
          </motion.p>
        )}
      </motion.div>
    </motion.section>
  )
}
