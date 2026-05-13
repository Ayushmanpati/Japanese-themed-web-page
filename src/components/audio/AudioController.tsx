import { useState, useRef, useEffect } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { motion } from 'framer-motion'

interface AudioControllerProps {
  hasEntered: boolean
  zoroMode?: boolean
}

export default function AudioController({ hasEntered, zoroMode = false }: AudioControllerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [quoteMode, setQuoteMode] = useState(false)
  const [endMode, setEndMode] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const windAudioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const onQuoteEnter = () => setQuoteMode(true)
    const onQuoteLeave = () => setQuoteMode(false)
    const onEndEnter = () => setEndMode(true)
    const onEndLeave = () => setEndMode(false)

    window.addEventListener('music-quote-enter', onQuoteEnter)
    window.addEventListener('music-quote-leave', onQuoteLeave)
    window.addEventListener('music-end-enter', onEndEnter)
    window.addEventListener('music-end-leave', onEndLeave)
    
    return () => {
      window.removeEventListener('music-quote-enter', onQuoteEnter)
      window.removeEventListener('music-quote-leave', onQuoteLeave)
      window.removeEventListener('music-end-enter', onEndEnter)
      window.removeEventListener('music-end-leave', onEndLeave)
    }
  }, [])

  useEffect(() => {
    if (hasEntered && !isPlaying) {
      setIsPlaying(true)
    }
  }, [hasEntered])

  useEffect(() => {
    if (audioRef.current && windAudioRef.current) {
      if (isPlaying) {
        audioRef.current.volume = 0
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e))
        
        // Gentle fade-in over 3 seconds
        let volume = 0
        const fadeInterval = setInterval(() => {
          if (volume < 1) {
            volume += 0.05
            if (audioRef.current && !zoroMode) {
              audioRef.current.volume = Math.min(1, volume)
            }
          } else {
            clearInterval(fadeInterval)
          }
        }, 150)
      } else {
        audioRef.current.pause()
        windAudioRef.current.pause()
      }
    }
  }, [isPlaying])

  useEffect(() => {
    if (!audioRef.current || !isPlaying) return

    // Calculate target music volume based on active sections
    let targetMusicVolume = 0.4 // Low default volume
    if (endMode) {
      targetMusicVolume = 0.05 // Extremely soft lingering volume at the very end
    } else if (zoroMode) {
      targetMusicVolume = 0.15 // Subtle reduction during Zoro scene
    } else if (quoteMode) {
      targetMusicVolume = 0.2 // Slightly quieter during quotes
    }

    const targetWindVolume = zoroMode ? 0.8 : 0.0

    if (zoroMode && windAudioRef.current && windAudioRef.current.paused) {
      windAudioRef.current.volume = 0
      windAudioRef.current.play().catch(e => console.error("Wind playback failed:", e))
    }

    const fadeInterval = setInterval(() => {
      if (audioRef.current) {
        let musicV = audioRef.current.volume
        // Smoothly adjust music volume towards target
        if (Math.abs(musicV - targetMusicVolume) > 0.05) {
          audioRef.current.volume = musicV + (musicV < targetMusicVolume ? 0.02 : -0.02)
        }
      }

      if (windAudioRef.current) {
        let windV = windAudioRef.current.volume
        if (Math.abs(windV - targetWindVolume) > 0.05) {
          windAudioRef.current.volume = windV + (windV < targetWindVolume ? 0.05 : -0.05)
        } else if (!zoroMode && windV <= 0.05) {
          windAudioRef.current.pause()
        }
      }
    }, 150)

    return () => clearInterval(fadeInterval)
  }, [zoroMode, isPlaying, quoteMode, endMode])

  return (
    <div className={`fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 transition-opacity duration-1000 ${hasEntered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <audio 
        ref={audioRef} 
        loop 
        src="/audio/spring-night.mp3" 
      />
      <audio
        ref={windAudioRef}
        loop
        src="https://cdn.pixabay.com/download/audio/2022/10/25/audio_2491a6e975.mp3?filename=wind-outside-sound-ambient-141941.mp3"
      />
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className={`relative glass p-4 md:p-5 rounded-full text-warm-beige hover:text-sakura-pink transition-all duration-500 flex items-center justify-center active:scale-90 hover:bg-white/10 ${isPlaying ? 'shadow-[0_0_20px_rgba(247,198,208,0.4)] hover:shadow-[0_0_30px_rgba(247,198,208,0.6)]' : 'shadow-[0_0_10px_rgba(234,219,200,0.1)]'}`}
        aria-label={isPlaying ? "Mute music" : "Play music"}
      >
        {isPlaying && (
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-sakura-pink/20 pointer-events-none"
          />
        )}
        <div className="relative z-10 transition-transform duration-500 hover:scale-110">
          {isPlaying ? <Volume2 size={20} strokeWidth={1.5} /> : <VolumeX size={20} strokeWidth={1.5} />}
        </div>
      </button>
    </div>
  )
}
