import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface IntroScreenProps {
  onEnter: () => void
  hasEntered: boolean
}

export default function IntroScreen({ onEnter, hasEntered }: IntroScreenProps) {
  const [showButton, setShowButton] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Show button after a short delay for cinematic effect
  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 4000)
    return () => clearTimeout(timer)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const moveX = (clientX / window.innerWidth - 0.5) * -30
    const moveY = (clientY / window.innerHeight - 0.5) * -30
    setMousePosition({ x: moveX, y: moveY })
  }

  return (
    <AnimatePresence>
      {!hasEntered && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          onMouseMove={handleMouseMove}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden"
        >
          {/* Background Blurred Ambient Copy to fill empty spaces and add bloom */}
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.4 }}
            transition={{ duration: 20, ease: "easeOut" }}
            src="/images/opening/spring-quote-bg.png"
            className="absolute inset-0 w-full h-full object-cover blur-[40px] z-0 opacity-40"
            alt=""
          />

          {/* Main Cinematic Image with Parallax & Slow Zoom */}
          <motion.div
            animate={{ x: mousePosition.x, y: mousePosition.y }}
            transition={{ type: "spring", stiffness: 40, damping: 30 }}
            className="absolute inset-0 w-full h-full flex items-center justify-center p-6 md:p-16 z-10"
          >
            <motion.img 
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: 1.05, opacity: 1 }}
              transition={{ duration: 20, ease: "easeOut" }}
              src="/images/opening/spring-quote-bg.png"
              className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(247,198,208,0.2)]"
              alt="Cinematic Opening"
            />
          </motion.div>

          {/* Dreamy Fog Overlay */}
          <div className="absolute inset-0 z-20 opacity-30 pointer-events-none mix-blend-screen bg-gradient-to-t from-sakura-pink/20 via-transparent to-transparent" />
          
          {/* Warm Lantern Glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#FFD1A9]/20 via-transparent to-transparent pointer-events-none z-20 mix-blend-plus-lighter opacity-70" />

          {/* Vignette */}
          <div className="absolute inset-0 z-30 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] md:shadow-[inset_0_0_200px_rgba(0,0,0,0.9)] pointer-events-none" />

          {/* Particles & Sakura Petals */}
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  y: "110vh", 
                  x: `${Math.random() * 100}vw`,
                  opacity: 0,
                  rotate: 0,
                  scale: Math.random() * 0.5 + 0.5
                }}
                animate={{ 
                  y: "-10vh", 
                  x: `${Math.random() * 100}vw`,
                  opacity: [0, 0.8, 0],
                  rotate: 360,
                }}
                transition={{ 
                  duration: Math.random() * 15 + 15,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 10
                }}
                className={`absolute ${i % 3 === 0 ? 'w-3 h-3 md:w-4 md:h-4 bg-sakura-pink/40 rounded-bl-[50%] rounded-tr-[50%] blur-[1px]' : 'w-1 h-1 bg-[#FFD1A9]/60 rounded-full blur-[2px]'}`}
              />
            ))}
          </div>

          {/* Enter Button */}
          <AnimatePresence>
            {showButton && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2 }}
                onClick={onEnter}
                className="absolute bottom-12 md:bottom-20 z-40 px-10 py-3 border border-warm-beige/30 rounded-full text-warm-beige/90 uppercase tracking-[0.4em] text-xs md:text-sm hover:bg-warm-beige/20 hover:border-warm-beige/80 hover:text-white transition-all duration-700 shadow-[0_0_30px_rgba(234,219,200,0.1)] hover:shadow-[0_0_40px_rgba(234,219,200,0.3)] backdrop-blur-md"
              >
                Enter
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
