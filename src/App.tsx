import { useEffect, useRef, useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import Lenis from 'lenis'
import { Canvas } from '@react-three/fiber'
import Scene from './components/canvas/Scene'
import HeroSection from './components/dom/HeroSection'
import StorySection from './components/dom/StorySection'
import MemoryGallery from './components/dom/MemoryGallery'
import SurpriseSequence from './components/dom/SurpriseSequence'
import AudioController from './components/audio/AudioController'
import IntroScreen from './components/dom/IntroScreen'
import ThingsAboutYou from './components/dom/ThingsAboutYou'
import ZoroSequence from './components/dom/ZoroSequence'
import CinematicQuote from './components/dom/CinematicQuote'
import HiddenLetter from './components/dom/HiddenLetter'
import SignatureCredit from './components/dom/SignatureCredit'

function App() {
  const [hasEntered, setHasEntered] = useState(false)
  const [zoroMode, setZoroMode] = useState(false)
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    })

    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    if (lenisRef.current) {
      if (!hasEntered) {
        lenisRef.current.stop()
      } else {
        lenisRef.current.start()
      }
    }
  }, [hasEntered])

  return (
    <div className="relative w-full bg-midnight-blue text-cream-white selection:bg-sakura-pink/30 selection:text-cream-white min-h-screen font-sans">
      
      <IntroScreen hasEntered={hasEntered} onEnter={() => setHasEntered(true)} />

      {/* 3D Background Canvas */}
      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <Scene hasEntered={hasEntered} zoroMode={zoroMode} />
          </Suspense>
        </Canvas>
      </div>

      {/* Audio Controller */}
      <AudioController hasEntered={hasEntered} zoroMode={zoroMode} />

      {/* DOM Content Layer */}
      <main className={`relative z-10 w-full transition-opacity duration-1000 ${hasEntered ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
        <HeroSection />
        
        <CinematicQuote 
          japaneseText="ずっと友達でいよう"
          englishText="“let’s always be friends”"
          romajiText="“zutto tomodachi de iyou”"
          theme="light"
        />

        <StorySection />
        <MemoryGallery />

        <CinematicQuote 
          japaneseText="やっぱり君がいい"
          englishText="“I’d still choose you”"
          romajiText="“Yappari kimi ga ii”"
          theme="dark"
        />

        <ThingsAboutYou />
        <ZoroSequence setZoroMode={setZoroMode} />
        <SurpriseSequence />

        <CinematicQuote 
          japaneseText="꽃처럼 피어나"
          englishText="“bloom like a flower”"
          theme="bloom"
        />

        
        {/* Footer / Ending Scene */}
        <section className="min-h-screen flex flex-col items-center justify-center relative py-20 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.3 }}
            transition={{ duration: 3 }}
            className="absolute inset-0 z-0"
          >
            <img src="/images/memories/final-memory.jpeg" className="w-full h-full object-cover" alt="" loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-t from-midnight-blue via-midnight-blue/40 to-midnight-blue" />
          </motion.div>

          <div className="text-center z-10 p-8 glass rounded-3xl max-w-2xl mx-auto backdrop-blur-xl bg-midnight-blue/20 border-warm-beige/10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5 }}
              className="text-4xl md:text-6xl font-light mb-8 text-sakura-pink tracking-[0.2em]"
            >
              Happy Birthday.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
              className="text-xl md:text-2xl text-warm-beige font-light leading-relaxed font-serif italic"
            >
              May your days be as beautiful and peaceful as a spring night under the sakura trees.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-16 text-xs font-mono uppercase tracking-[0.5em] text-sakura-pink/40"
            >
              The End
            </motion.div>
          </div>
        </section>

        {/* The Final Hidden Letter */}
        <HiddenLetter />

        {/* Cinematic Signature Credit */}
        <SignatureCredit />
      </main>
    </div>
  )
}

export default App
