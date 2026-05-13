import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function HiddenLetter() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Creates a large scrollable area for a cinematic transition into the final scene
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  })

  // The background gradually fades to pure black as they scroll past the footer
  const bgOpacity = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <motion.section 
      ref={containerRef} 
      className="h-[250vh] relative w-full flex flex-col items-center justify-end pb-[10vh]"
      onViewportEnter={() => window.dispatchEvent(new CustomEvent('music-end-enter'))}
      onViewportLeave={() => window.dispatchEvent(new CustomEvent('music-end-leave'))}
      viewport={{ margin: "-20%" }}
    >
      {/* Complete Black Transition Background */}
      <motion.div 
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 bg-black z-0"
      />

      {/* The Letter Section - reveals only when user gets to the very bottom */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center overflow-hidden">
        
        {/* Ambient warm paper texture that slowly fades in */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.15 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 5, delay: 1 }}
          className="absolute inset-0 bg-[#f4e4d4] mix-blend-screen pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
        
        {/* Soft vignette edges */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.95 }}
          viewport={{ once: true }}
          transition={{ duration: 4 }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] pointer-events-none z-10" 
        />

        {/* A single falling sakura petal */}
        <motion.div
          initial={{ y: "-20vh", x: "45vw", opacity: 0, rotate: 0 }}
          whileInView={{ y: "120vh", x: "55vw", opacity: [0, 0.7, 0], rotate: 200 }}
          viewport={{ once: true }}
          transition={{ duration: 15, ease: "linear", delay: 1 }}
          className="absolute w-4 h-4 md:w-5 md:h-5 bg-sakura-pink/50 rounded-bl-[50%] rounded-tr-[50%] blur-[1px] z-20 pointer-events-none"
        />

        {/* Letter Content Container - Fades to complete black at the very end */}
        <motion.div 
          initial={{ opacity: 1 }}
          whileInView={{ opacity: [1, 1, 0] }}
          viewport={{ once: true }}
          transition={{ duration: 25, times: [0, 0.85, 1], ease: "easeInOut" }}
          className="relative z-30 max-w-3xl px-8 w-full flex flex-col items-center text-center py-20"
        >
          {/* Japanese Letter Typography */}
          <motion.div
            initial={{ opacity: 0, filter: 'blur(8px)', y: 15 }}
            whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 4, delay: 2, ease: "easeOut" }}
            className="text-[#EADBC8] font-japanese text-xl md:text-3xl leading-[2.5] tracking-[0.15em] mb-12 md:mb-16 whitespace-pre-line drop-shadow-[0_0_20px_rgba(234,219,200,0.15)] mix-blend-plus-lighter"
          >
            {`あなたの頑張りを\nわかってくれる人は\n必ず現れる\n\n「なんでわたしだけ…」は\nきっと報われるよ。大丈夫。`}
          </motion.div>

          {/* English Translation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 4, delay: 7, ease: "easeOut" }}
            className="text-sakura-pink/90 font-handwritten text-2xl md:text-4xl leading-[1.8] whitespace-pre-line max-w-xl mx-auto drop-shadow-md mix-blend-screen"
          >
            {`“One day, someone will see and appreciate all your effort.\n\nEven the feeling of\n‘Why is it only me?’\nwill someday be rewarded.\n\nYou’ll be alright.”`}
          </motion.div>

          {/* Final Emotional Line */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 4, delay: 13, ease: "easeInOut" }}
            className="text-[#EADBC8]/50 font-handwritten text-xl md:text-2xl mt-24 drop-shadow-sm tracking-wide"
          >
            and i’ll always be rooting for you.
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}
