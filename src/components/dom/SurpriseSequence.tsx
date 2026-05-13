import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function SurpriseSequence() {
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <section className="py-32 w-full relative flex items-center justify-center">
      <div className="text-center z-10 relative">
        <motion.button
          onClick={() => setIsRevealed(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`glass px-8 py-4 rounded-full flex items-center gap-3 text-sakura-pink transition-all duration-500 ${isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:bg-sakura-pink/10 hover:shadow-[0_0_20px_rgba(247,198,208,0.3)]'}`}
        >
          <Sparkles size={20} />
          <span className="font-light tracking-widest uppercase text-sm">Make a wish</span>
        </motion.button>

        <AnimatePresence>
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-max max-w-[90vw]"
            >
              <div className="glass p-12 rounded-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-sakura-pink/20 to-transparent" />
                <h3 className="text-4xl md:text-6xl font-light text-cream-white mb-6" style={{ textShadow: '0 0 30px rgba(247,198,208,0.5)' }}>
                  You are the magic.
                </h3>
                <p className="text-xl text-warm-beige font-light">
                  Thank you for being exactly who you are.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
