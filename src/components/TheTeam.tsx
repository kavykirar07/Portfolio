import React, { useRef, Suspense } from 'react'
import { motion, useInView } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { useTheme } from '../contexts/ThemeContext'

// ── Data (with tech badges) ───────────────────────────────────────────────────
const team = [
  {
    role: 'Lead 3D Developer',
    name: 'KAVY',
    kpi: '60fps Runtime',
    emoji: '🧊',
    accent: '#ADFF2F',
    badges: ['Three.js', 'WebGL', 'R3F'],
  },
  {
    role: 'Full-Stack / AI Engineer',
    name: 'RAJAT',
    kpi: 'API Uptime: 99.9%',
    emoji: '⚡',
    accent: '#00F0FF',
    badges: ['Node.js', 'OpenAI', 'MongoDB'],
  },
  {
    role: 'UX / Spatial Designer',
    name: 'PRITHVI',
    kpi: 'Token Compliance',
    emoji: '🎨',
    accent: '#BF7FFF',
    badges: ['Figma', 'Spline', 'Motion'],
  },
  {
    role: 'The Rainmaker',
    name: 'ABHISHEK',
    kpi: '2 Calls / Week',
    emoji: '💰',
    accent: '#ADFF2F',
    badges: ['Strategy', 'Sales', 'Growth'],
  },
  {
    role: 'QA & Content',
    name: 'DIVYANSH',
    kpi: 'LH > 85',
    emoji: '✅',
    accent: '#00F0FF',
    badges: ['Lighthouse', 'SEO', 'Testing'],
  },
]

// ── 3D: Low-poly wireframe icosahedron that follows the mouse ─────────────────
function IndustrialGeo({ isDark }: { isDark: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const wire1Ref = useRef<THREE.Mesh>(null)
  const wire2Ref = useRef<THREE.Mesh>(null)
  const { mouse } = useThree()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (!meshRef.current) return

    // lazy mouse follow
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      mouse.x * 0.6,
      0.03,
    )
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      -mouse.y * 0.4,
      0.03,
    )

    // slow auto-spin for depth
    if (wire1Ref.current) wire1Ref.current.rotation.y = t * 0.12
    if (wire2Ref.current) wire2Ref.current.rotation.z = t * 0.08
  })

  const limeColor = isDark ? '#ADFF2F' : '#5A9200'
  const cyanColor = isDark ? '#00F0FF' : '#007A99'
  const emissiveI = isDark ? 0.6 : 0.1

  return (
    <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.8}>
      <group scale={2.8}>
        {/* core solid */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={isDark ? '#111' : '#e0e0e0'}
            emissive={limeColor}
            emissiveIntensity={emissiveI * 0.25}
            roughness={0.8}
            metalness={0.3}
            wireframe={false}
          />
        </mesh>

        {/* lime wireframe overlay */}
        <mesh ref={wire1Ref}>
          <icosahedronGeometry args={[1.01, 0]} />
          <meshBasicMaterial color={limeColor} wireframe opacity={0.45} transparent />
        </mesh>

        {/* outer cyan wireframe shell — rotated */}
        <mesh ref={wire2Ref} rotation={[0.5, 0.3, 0]}>
          <icosahedronGeometry args={[1.35, 1]} />
          <meshBasicMaterial color={cyanColor} wireframe opacity={0.12} transparent />
        </mesh>
      </group>
    </Float>
  )
}

// ── Card animation variants ───────────────────────────────────────────────────
const slideFromRight = {
  hidden: { opacity: 0, x: 80 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

// ── Component ─────────────────────────────────────────────────────────────────
const TheTeam: React.FC = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      id="team"
      className={`
        snap-section relative flex items-center overflow-hidden
        ${isDark ? 'bg-[#080808]' : 'bg-slate-50'}
      `}
    >
      {/* ── 3D background canvas (desktop only) ── */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        <Canvas
          camera={{ position: [0, 0, 7], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          className="no-transition"
        >
          <Suspense fallback={null}>
            <ambientLight intensity={isDark ? 0.08 : 0.3} />
            <pointLight position={[4, 4, 4]} intensity={isDark ? 1.2 : 0.6} color="#ADFF2F" />
            <pointLight position={[-4, -3, 2]} intensity={isDark ? 0.8 : 0.4} color="#00F0FF" />
            <IndustrialGeo isDark={isDark} />
          </Suspense>
        </Canvas>
      </div>

      {/* ── Radial vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 65% 65% at 80% 50%, transparent 30%, rgba(8,8,8,0.85) 80%)'
            : 'radial-gradient(ellipse 65% 65% at 80% 50%, transparent 30%, rgba(248,250,252,0.85) 80%)',
        }}
      />

      {/* ── Content ── */}
      <div
        ref={ref}
        className="relative z-10 w-full max-w-5xl mx-auto px-6 lg:px-16 pt-16"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="section-label mb-3">The Crazy 5</p>
          <h2
            className={`
              font-outfit font-black leading-tight
              text-4xl sm:text-5xl lg:text-6xl
              ${isDark ? 'text-white' : 'text-gray-900'}
            `}
          >
            The <span className="gradient-text">Collective.</span>
          </h2>
          <p className={`font-inter text-sm mt-3 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
            5 specialists. 1 shared obsession: building things nobody else can.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="tech-badge">Ownership Matrix</span>
            <span className="tech-badge">High-Tech Stack</span>
          </div>
        </motion.div>

        {/* ── Desktop: vertical staggered list (Neon Matrix Style) ── */}
        <div className="hidden lg:flex flex-col gap-3">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              custom={i}
              variants={slideFromRight}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="neon-card glass-card p-5 flex items-center gap-5 group cursor-default"
              style={{ borderLeft: `2px solid ${member.accent}30`, borderRadius: '16px' }}
              whileHover={{ x: 6, transition: { duration: 0.2 } }}
            >
              {/* Scanning Line */}
              <div className="scan-line" />

              {/* Index */}
              <span
                className="font-inter text-xs w-6 flex-shrink-0 tabular-nums"
                style={{ color: member.accent, opacity: 0.7 }}
              >
                0{i + 1}
              </span>

              {/* Emoji */}
              <div
                className="text-xl w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ background: `${member.accent}12` }}
              >
                {member.emoji}
              </div>

              {/* Name + Role */}
              <div className="flex-1 min-w-0">
                <p
                  className={`font-outfit font-black text-lg tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  {member.name}
                </p>
                <p className={`font-inter text-xs mt-0.5 truncate ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                  {member.role}
                </p>
              </div>

              {/* Tech Badges */}
              <div className="hidden xl:flex items-center gap-1.5 flex-shrink-0">
                {member.badges.map((badge) => (
                  <span key={badge} className="tech-badge">
                    {badge}
                  </span>
                ))}
              </div>

              {/* KPI badge */}
              <span
                className="font-inter text-xs px-3 py-1.5 rounded-full flex-shrink-0 font-medium"
                style={{ background: `${member.accent}15`, color: member.accent }}
              >
                {member.kpi}
              </span>

              {/* Hover accent dot */}
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: member.accent, boxShadow: `0 0 6px ${member.accent}` }}
              />
            </motion.div>
          ))}
        </div>

        {/* ── Mobile: horizontal scroll cards ── */}
        <div className="lg:hidden flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="neon-card glass-card p-5 flex-shrink-0 snap-start flex flex-col gap-3"
              style={{
                width: '240px',
                borderTop: `2px solid ${member.accent}40`,
              }}
            >
              {/* Scanning Line */}
              <div className="scan-line" />

              <div className="text-2xl">{member.emoji}</div>
              <div>
                <p className={`font-outfit font-black text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {member.name}
                </p>
                <p className={`font-inter text-[11px] mt-0.5 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                  {member.role}
                </p>
              </div>

              {/* Tech badges */}
              <div className="flex flex-wrap gap-1">
                {member.badges.slice(0, 2).map((badge) => (
                  <span key={badge} className="tech-badge">
                    {badge}
                  </span>
                ))}
              </div>

              <span
                className="self-start font-inter text-[11px] px-2.5 py-1 rounded-full font-medium"
                style={{ background: `${member.accent}18`, color: member.accent }}
              >
                {member.kpi}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Footer tag */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.5 }}
          className={`font-inter text-[11px] mt-8 ${isDark ? 'text-white/20' : 'text-gray-300'}`}
        >
          CrazyWeb.Studio · Indore, MP · Est. 2026 ·{' '}
          <span className={isDark ? 'text-cyber-lime/40' : 'text-indigo-400'}>
            Beyond the Scroll. Into the Space.
          </span>
        </motion.p>
      </div>
    </section>
  )
}

export default TheTeam
