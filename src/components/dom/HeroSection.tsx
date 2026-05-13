import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <section className="h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Background Image Layer */}
      <motion.div 
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="/images/memories/hero-memory.jpeg" 
          alt="Hero Memory" 
          className="w-full h-full object-cover"
          loading="eager"
          decoding="sync"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight-blue/40 via-midnight-blue/20 to-midnight-blue/80" />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-midnight-blue/80 pointer-events-none z-[1]" />
      
      <div className="text-center z-10 px-6">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          className="text-4xl md:text-6xl lg:text-8xl font-light text-cream-white tracking-widest mb-6"
          style={{ textShadow: '0 0 20px rgba(247, 198, 208, 0.4)' }}
        >
          HAPPY BIRTHDAY
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut", delay: 1.5 }}
          className="text-xl md:text-2xl text-sakura-pink font-light tracking-wide"
        >
          A cinematic journey through our memories
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 3 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-sm text-warm-beige/70 uppercase tracking-[0.3em]">Scroll Slowly</span>
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-[1px] h-12 bg-gradient-to-b from-warm-beige/70 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  )
}
