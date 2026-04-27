import React, { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Environment, Stars } from '@react-three/drei'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import * as THREE from 'three'

/* ── 3D Object: Anti-Gravity Glass Orb with Scroll Link ─────── */
function GlassOrb() {
  const meshRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const { mouse } = useThree()

  // Track scroll progress via a DOM-injected value
  useFrame((state) => {
    if (!meshRef.current || !ringRef.current || !groupRef.current) return
    const t = state.clock.getElapsedTime()

    // Read scroll progress from the DOM attribute
    const scrollAttr = document.getElementById('hero')?.getAttribute('data-scroll-progress')
    const scrollProgress = scrollAttr ? parseFloat(scrollAttr) : 0

    // Scale up as user scrolls (1.8 → 3.5 zoom-in "warp" effect)
    const targetScale = 1.8 + scrollProgress * 1.7
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.05)
    )

    // Increase rotation speed with scroll ("warp speed" effect)
    const rotSpeed = 0.08 + scrollProgress * 0.6

    // Mouse-reactive Z-axis depth
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      mouse.y * 0.4,
      0.06
    )
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      mouse.x * 0.4 + t * rotSpeed,
      0.06
    )

    // Ring orbital rotation - also accelerated by scroll
    ringRef.current.rotation.x = t * (0.3 + scrollProgress * 0.5)
    ringRef.current.rotation.z = t * (0.15 + scrollProgress * 0.3)
  })

  return (
    <Float speed={2.5} rotationIntensity={0.4} floatIntensity={1.2}>
      <group ref={groupRef}>
        {/* Core distortion orb */}
        <mesh ref={meshRef} scale={1}>
          <icosahedronGeometry args={[1, 5]} />
          <MeshDistortMaterial
            color="#1a1a1a"
            emissive="#ADFF2F"
            emissiveIntensity={0.25}
            roughness={0.05}
            metalness={0.95}
            distort={0.35}
            speed={2}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Outer glow ring */}
        <mesh ref={ringRef} scale={1.44}>
          <torusGeometry args={[1, 0.018, 12, 100]} />
          <meshStandardMaterial
            color="#00F0FF"
            emissive="#00F0FF"
            emissiveIntensity={1.5}
            transparent
            opacity={0.7}
          />
        </mesh>

        {/* Second ring offset */}
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={1.22}>
          <torusGeometry args={[1, 0.012, 8, 80]} />
          <meshStandardMaterial
            color="#ADFF2F"
            emissive="#ADFF2F"
            emissiveIntensity={1.2}
            transparent
            opacity={0.5}
          />
        </mesh>
      </group>
    </Float>
  )
}

/* ── Character Reveal Text Component ────────────────────────── */
interface CharRevealProps {
  text: string
  className?: string
  delay?: number
}

const CharReveal: React.FC<CharRevealProps> = ({ text, className = '', delay = 0 }) => {
  const chars = useMemo(() => text.split(''), [text])
  return (
    <span className={className}>
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}

/* ── Text Content ───────────────────────────────────────────── */
interface HeroTextProps {
  isDark: boolean
}

const HeroText: React.FC<HeroTextProps> = ({ isDark }) => {
  const item = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-col justify-center h-full max-w-xl"
    >
      <motion.p
        variants={item}
        initial="hidden"
        animate="visible"
        className={`section-label mb-5 ${isDark ? 'text-cyber-lime' : 'text-indigo-600'}`}
      >
        Indore • India • Est. 2026
      </motion.p>

      {/* Staggered character-reveal headline */}
      <h1
        className={`
          font-outfit font-black leading-[0.92] mb-6
          text-5xl sm:text-6xl lg:text-7xl xl:text-[82px]
          ${isDark ? 'text-white' : 'text-gray-900'}
        `}
      >
        <CharReveal text="Beyond" delay={0.2} />
        <br />
        <CharReveal text="the " delay={0.5} />
        <CharReveal
          text="Scroll."
          className="gradient-text glow-lime"
          delay={0.65}
        />
        <br />
        <CharReveal text="Into the " delay={0.95} />
        <CharReveal
          text="Space."
          className={isDark ? 'text-[#00F0FF]' : 'text-indigo-500'}
          delay={1.3}
        />
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
        className={`
          font-inter text-base lg:text-lg leading-relaxed mb-10
          ${isDark ? 'text-white/55' : 'text-gray-500'}
        `}
      >
        We don't build websites — we{' '}
        <span className={isDark ? 'text-white/90' : 'text-gray-800'}>architect digital dimensions.</span>{' '}
        3D immersive experiences that captivate, convert, and obliterate your competition.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 2.1, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-wrap gap-4 items-center"
      >
        <button
          id="hero-cta-btn"
          className="btn-primary"
          onClick={() => { const el = document.getElementById('food-guide'); el?.scrollIntoView({ behavior: 'smooth' }) }}
        >
          See the Food Guide
          <ArrowRight size={16} />
        </button>
        <button
          id="hero-services-btn"
          className="btn-outline"
          onClick={() => { const el = document.getElementById('services'); el?.scrollIntoView({ behavior: 'smooth' }) }}
        >
          Our Services
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 2.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex gap-8 mt-12 pt-8 border-t border-white/10"
      >
        {[
          { value: '5', label: 'Elite Specialists' },
          { value: '3D', label: 'First in Indore' },
          { value: '60fps', label: 'Performance Budget' },
        ].map((stat) => (
          <div key={stat.label}>
            <p className={`font-outfit font-black text-2xl ${isDark ? 'text-cyber-lime' : 'text-indigo-600'}`}>
              {stat.value}
            </p>
            <p className={`font-inter text-xs mt-0.5 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}

/* ── Main Hero3D Component ──────────────────────────────────── */
const Hero3D: React.FC = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const sectionRef = useRef<HTMLElement>(null)

  // Track scroll progress for the 3D scroll-link effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Pass scroll progress to the 3D scene via a data attribute
  const scrollVal = useTransform(scrollYProgress, [0, 1], [0, 1])

  // Update the data attribute on the section element
  React.useEffect(() => {
    const unsub = scrollVal.on('change', (v) => {
      const el = document.getElementById('hero')
      if (el) el.setAttribute('data-scroll-progress', v.toString())
    })
    return unsub
  }, [scrollVal])

  const scrollDown = () => {
    const el = document.getElementById('services')
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-scroll-progress="0"
      className={`
        snap-section relative flex items-center overflow-hidden
        ${isDark ? 'bg-black' : 'bg-slate-50'}
        bg-grid
      `}
    >
      {/* Radial glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 60% 60% at 70% 50%, rgba(173,255,47,0.06) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 60% 60% at 70% 50%, rgba(79,70,229,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full h-full flex items-center pt-16">
        <div className="container mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text with Character Reveal */}
          <HeroText isDark={isDark} />

          {/* Right: 3D Canvas with Scroll-Linked Planet */}
          <div className="hidden lg:block h-[500px] w-full">
            <Canvas
              className="no-transition"
              camera={{ position: [0, 0, 5], fov: 55 }}
              gl={{ antialias: true, alpha: true }}
            >
              <Suspense fallback={null}>
                <ambientLight intensity={isDark ? 0.15 : 0.4} />
                <pointLight position={[3, 3, 3]} intensity={isDark ? 2 : 1.5} color="#ADFF2F" />
                <pointLight position={[-3, -2, 2]} intensity={isDark ? 1.5 : 1} color="#00F0FF" />
                <pointLight position={[0, -4, 1]} intensity={0.5} color="#ffffff" />
                <GlassOrb />
                {isDark && <Stars radius={80} depth={40} count={1500} factor={3} fade />}
                <Environment preset={isDark ? 'night' : 'sunset'} />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 group"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        aria-label="Scroll down"
      >
        <span className={`font-inter text-xs tracking-widest uppercase ${isDark ? 'text-white/30 group-hover:text-white/60' : 'text-gray-400'} transition-colors`}>
          Scroll
        </span>
        <ChevronDown size={18} className={isDark ? 'text-cyber-lime' : 'text-indigo-500'} />
      </motion.button>
    </section>
  )
}

export default Hero3D
