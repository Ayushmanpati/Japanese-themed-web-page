import { useState, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'

const memories = [
  { id: 1, title: "CHAPTER I", caption: "Somehow surviving every hardship\nwith pure stubbornness and questionable decisions.\nProud of you though.", image: "/images/memories/memory-1.jpeg", align: 'left', color: 'bg-sakura-pink' },
  { id: 2, title: "CHAPTER II", caption: "Mrs. CEO look.\nBossing people around like she already runs three companies.", image: "/images/memories/memory-2.jpeg", align: 'right', color: 'bg-warm-beige' },
  { id: 3, title: "CHAPTER III", caption: "She’s beautiful exactly the way she is.\nNo edits needed.", image: "/images/memories/memory-3.jpeg", align: 'left', color: 'bg-cream-white' },
  { id: 4, title: "CHAPTER IV", caption: "The tiny little kid grew up…\nand somehow still stayed adorable.", image: "/images/memories/memory-4.jpeg", align: 'right', color: 'bg-deep-brown' },
  { id: 5, title: "CHAPTER V", caption: "Sundar?\nAbsolutely not.\nAnd no, I’m never admitting otherwise.", image: "/images/memories/memory-5.jpeg", align: 'left', color: 'bg-sakura-pink' },
  { id: 6, title: "CHAPTER VI", caption: "She really walks in,\nacts dramatic for five minutes,\nand still manages to slay effortlessly.", image: "/images/memories/memory-6.jpeg", align: 'right', color: 'bg-warm-beige' },
]

export default function MemoryGallery() {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Gentle overall parallax for the container
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  const selectedItem = memories.find(m => m.id === selectedId)

  return (
    <>
      <section ref={containerRef} className="py-32 w-full min-h-[200vh] relative flex flex-col items-center overflow-hidden">
        
        <motion.div style={{ y }} className="w-full max-w-5xl px-6 flex flex-col space-y-32 md:space-y-48 my-32">
          {memories.map((mem) => (
            <motion.div
              key={mem.id}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={`w-full flex ${mem.align === 'left' ? 'justify-start md:pr-48' : 'justify-end md:pl-48'}`}
            >
              {/* Polaroid Card */}
              <motion.div
                layoutId={`card-${mem.id}`}
                onClick={() => setSelectedId(mem.id)}
                whileHover={{ scale: 1.05, rotate: mem.align === 'left' ? -2 : 2 }}
                className="glass p-4 md:p-6 rounded-2xl cursor-pointer w-[85vw] md:w-96 shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-cream-white/5 border border-cream-white/10 relative group"
              >
                {/* Photo Area */}
                <motion.div 
                  layoutId={`photo-${mem.id}`}
                  className={`w-full aspect-square rounded-xl bg-midnight-blue/20 backdrop-blur-sm mb-6 relative overflow-hidden transition-colors duration-700`}
                >
                  <img 
                    src={mem.image} 
                    alt={mem.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
                  <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]" />
                </motion.div>
                
                {/* Text Area */}
                <div className="px-2">
                  <motion.div layoutId={`title-${mem.id}`} className="text-sakura-pink font-mono text-xs tracking-[0.3em] mb-3 opacity-70">
                    {mem.title}
                  </motion.div>
                  <motion.p layoutId={`caption-${mem.id}`} className="text-warm-beige font-serif italic text-2xl font-light tracking-wide whitespace-pre-line">
                    “{mem.caption}”
                  </motion.p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Cinematic Modal Expansion */}
      <AnimatePresence>
        {selectedId && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setSelectedId(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-midnight-blue/90 backdrop-blur-2xl p-6"
          >
            {/* Drifting Petals overlay specifically for modal */}
            <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay" style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png")' }} />

            <motion.div
              layoutId={`card-${selectedItem.id}`}
              onClick={(e) => e.stopPropagation()}
              className="glass p-6 md:p-10 rounded-3xl w-full max-w-4xl bg-midnight-blue/40 border border-cream-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col md:flex-row gap-8 md:gap-12 items-center"
            >
              {/* Modal Photo Area */}
              <motion.div 
                layoutId={`photo-${selectedItem.id}`}
                className={`w-full md:w-1/2 aspect-square md:aspect-[4/5] rounded-2xl relative overflow-hidden shadow-2xl`}
              >
                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.title} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-bl from-transparent to-black/60" />
              </motion.div>
              
              {/* Modal Text Area */}
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <motion.div layoutId={`title-${selectedItem.id}`} className="text-sakura-pink font-mono text-sm tracking-[0.4em] mb-6">
                  {selectedItem.title}
                </motion.div>
                <motion.p layoutId={`caption-${selectedItem.id}`} className="text-cream-white font-serif italic text-2xl md:text-5xl font-light leading-tight drop-shadow-xl whitespace-pre-line">
                  “{selectedItem.caption}”
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 1 }}
                  className="mt-12 w-12 h-[1px] bg-warm-beige/30"
                />
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="mt-8 text-warm-beige/70 text-sm font-light leading-relaxed max-w-sm"
                >
                  Every moment we share becomes a part of this growing scrapbook. You bring color to every chapter of my life.
                </motion.p>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  onClick={() => setSelectedId(null)}
                  className="mt-8 md:mt-12 py-4 pr-8 self-start text-xs font-mono text-sakura-pink/50 hover:text-sakura-pink tracking-[0.2em] transition-all active:scale-95 uppercase"
                >
                  [ Close Memory ]
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
