import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Sparkles, Float, MeshReflectorMaterial } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette, DepthOfField } from '@react-three/postprocessing'
import * as THREE from 'three'

function SakuraParticles({ zoroMode }: { zoroMode: boolean }) {
  const { size } = useThree()
  const isMobile = size.width < 768
  const particlesCount = isMobile ? 150 : 500
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3)
    for (let i = 0; i < particlesCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30 // x: -15 to 15
      pos[i * 3 + 1] = Math.random() * 15     // y: 0 to 15
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60 - 15 // z: +15 to -45
    }
    return pos
  }, [particlesCount])

  const pointsRef = useRef<THREE.Points>(null)
  const timeRef = useRef(0)
  const targetSpeed = useRef(1)

  useFrame((_state, delta) => {
    targetSpeed.current = THREE.MathUtils.lerp(targetSpeed.current, zoroMode ? 0.05 : 1, 0.02)
    timeRef.current += delta * targetSpeed.current

    if (pointsRef.current) {
      pointsRef.current.rotation.y = timeRef.current * 0.02
      pointsRef.current.position.y = Math.sin(timeRef.current * 0.1) * 0.5
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#F7C6D0"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// Global reusable geometries and materials for performance optimization
const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 4)
const trunkMat = new THREE.MeshStandardMaterial({ color: '#1f1614', roughness: 1 })

const leafGeo1 = new THREE.IcosahedronGeometry(2, 1)
const leafGeo2 = new THREE.IcosahedronGeometry(1.5, 1)
const leafGeo3 = new THREE.IcosahedronGeometry(1.8, 1)
const leafMat = new THREE.MeshStandardMaterial({ color: '#F7C6D0', roughness: 0.8, emissive: '#F7C6D0', emissiveIntensity: 0.05 })

const postGeo = new THREE.CylinderGeometry(0.05, 0.05, 1)
const postMat = new THREE.MeshStandardMaterial({ color: '#2a1f1a', roughness: 0.9 })

const boxGeo = new THREE.BoxGeometry(0.3, 0.4, 0.3)
const boxMat = new THREE.MeshStandardMaterial({ color: '#FFF7F2', emissive: '#F7C6D0', emissiveIntensity: 2 })

const distantBoxGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5)
const distantBoxMat = new THREE.MeshBasicMaterial({ color: '#EADBC8' })

function Lantern({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Wooden Post */}
      <mesh position={[0, 0.5, 0]} geometry={postGeo} material={postMat} />
      {/* Lantern Box */}
      <mesh position={[0, 1.2, 0]} geometry={boxGeo} material={boxMat} />
      {/* Light */}
      <pointLight position={[0, 1.2, 0]} intensity={2} distance={10} color="#F7C6D0" />
    </group>
  )
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 2, 0]} geometry={trunkGeo} material={trunkMat} />
      {/* Leaves */}
      <mesh position={[0, 4.5, 0]} geometry={leafGeo1} material={leafMat} />
      <mesh position={[1, 4, 1]} geometry={leafGeo2} material={leafMat} />
      <mesh position={[-1, 4.2, -0.5]} geometry={leafGeo3} material={leafMat} />
    </group>
  )
}

function Ground({ zoroMode }: { zoroMode: boolean }) {
  const reflectorColor = useRef(new THREE.Color('#0a0d14'))
  const { size } = useThree()
  const isMobile = size.width < 768
  
  useFrame(() => {
    const targetHex = zoroMode ? '#020b05' : '#0a0d14'
    reflectorColor.current.lerp(new THREE.Color(targetHex), 0.02)
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -15]}>
      <planeGeometry args={[30, 80]} />
      <MeshReflectorMaterial
        blur={[100, 50]}
        resolution={isMobile ? 256 : 512}
        mixBlur={1}
        mixStrength={10}
        roughness={0.6}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color={reflectorColor.current}
        metalness={0.8}
        mirror={0.5}
      />
    </mesh>
  )
}

function CameraController({ hasEntered }: { hasEntered: boolean }) {
  useFrame((state) => {
    let targetZ = hasEntered ? 5 : 8
    let targetY = hasEntered ? 1.5 : 2
    
    if (hasEntered) {
      // Calculate scroll progress 0 to 1
      const scrollY = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0
      
      // Move camera forward based on scroll (from z=5 to z=-35)
      targetZ = 5 - progress * 40
      targetY = 1.5 - Math.sin(progress * Math.PI) * 0.3 // Slight bobbing down
    }

    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05)
    
    // Look ahead smoothly
    state.camera.lookAt(0, 1.5, state.camera.position.z - 10)
  })
  return null
}

function DistantLights() {
  const lights = useMemo(() => {
    const items = []
    for (let i = 0; i < 15; i++) {
      // Distant background positions
      const x = (Math.random() > 0.5 ? 1 : -1) * (15 + Math.random() * 20)
      const y = Math.random() * 10
      const z = -40 - Math.random() * 20
      
      items.push(
        <mesh key={`dl-${i}`} position={[x, y, z]} geometry={distantBoxGeo} material={distantBoxMat} />
      )
    }
    return items
  }, [])

  return <group>{lights}</group>
}

// Controller for globally lerping fog and background color
function EnvironmentColorController({ zoroMode }: { zoroMode: boolean }) {
  useFrame((state) => {
    const targetColor = new THREE.Color(zoroMode ? '#03140a' : '#0a0d14')
    state.scene.background = (state.scene.background as THREE.Color)?.lerp(targetColor, 0.02) || targetColor
    if (state.scene.fog) {
      state.scene.fog.color.lerp(targetColor, 0.02)
    }
  })
  return null
}

export default function Scene({ hasEntered, zoroMode = false }: { hasEntered: boolean, zoroMode?: boolean }) {
  // Generate pairs of lanterns and trees along the path
  const environmentProps = useMemo(() => {
    const items = []
    for (let i = 0; i < 8; i++) {
      const zPos = -i * 6 + 2 // from z=2 to z=-40
      // Lanterns
      items.push(<Lantern key={`l-L-${i}`} position={[-2.5, 0, zPos]} />)
      items.push(<Lantern key={`l-R-${i}`} position={[2.5, 0, zPos]} />)
      // Trees
      items.push(<Tree key={`t-L-${i}`} position={[-4.5, 0, zPos - 1]} />)
      items.push(<Tree key={`t-R-${i}`} position={[4.5, 0, zPos - 2]} />)
    }
    return items
  }, [])

  const { size } = useThree()
  const isMobile = size.width < 768

  return (
    <>
      <CameraController hasEntered={hasEntered} />
      <color attach="background" args={['#0a0d14']} />
      <fog attach="fog" args={['#0a0d14', 5, 30]} />
      <EnvironmentColorController zoroMode={zoroMode} />
      
      <ambientLight intensity={hasEntered ? 0.3 : 0.05} />
      <directionalLight position={[5, 10, -10]} intensity={1.5} color={zoroMode ? "#cbfadd" : "#FFF7F2"} />
      
      <Ground zoroMode={zoroMode} />

      {environmentProps}
      <DistantLights />

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <SakuraParticles zoroMode={zoroMode} />
      </Float>

      {/* Magical glowing dust */}
      <Sparkles count={isMobile ? 50 : 200} scale={[20, 10, 60]} position={[0, 2, -15]} size={2} speed={0.4} color={zoroMode ? "#50e38d" : "#EADBC8"} opacity={0.3} />

      {isMobile ? (
        <EffectComposer multisampling={0}>
          <Bloom luminanceThreshold={0.5} mipmapBlur intensity={hasEntered ? 1.0 : 3.0} />
          <Noise opacity={0.03} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      ) : (
        <EffectComposer multisampling={2}>
          <DepthOfField focusDistance={0.02} focalLength={0.1} bokehScale={3} height={480} />
          <Bloom luminanceThreshold={0.5} mipmapBlur intensity={hasEntered ? 1.0 : 3.0} />
          <Noise opacity={0.03} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      )}
    </>
  )
}
