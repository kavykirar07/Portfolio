import React, { useState, Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  MapPin, Mail, MessageCircle, Calendar,
  ArrowRight, Github, Instagram, Linkedin,
  Zap, Send, Loader2, CheckCircle2, AlertTriangle,
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import * as THREE from 'three'
import axios from 'axios'

// ── API Config ────────────────────────────────────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// ── Toast Notification ────────────────────────────────────────────────────────
interface ToastData {
  type: 'success' | 'error'
  message: string
}

const NeonToast: React.FC<{ toast: ToastData; onClose: () => void }> = ({ toast, onClose }) => {
  const isSuccess = toast.type === 'success'
  React.useEffect(() => { const t = setTimeout(onClose, 4500); return () => clearTimeout(t) }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl border font-inter text-sm"
      style={{
        background: 'rgba(13,13,13,0.85)',
        backdropFilter: 'blur(20px)',
        borderColor: isSuccess ? 'rgba(173,255,47,0.3)' : 'rgba(255,80,80,0.3)',
        boxShadow: isSuccess
          ? '0 0 40px rgba(173,255,47,0.12), 0 8px 32px rgba(0,0,0,0.4)'
          : '0 0 40px rgba(255,80,80,0.12), 0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {isSuccess
        ? <CheckCircle2 size={18} className="text-cyber-lime flex-shrink-0" />
        : <AlertTriangle size={18} className="text-red-400 flex-shrink-0" />}
      <span className={isSuccess ? 'text-cyber-lime' : 'text-red-400'}>{toast.message}</span>
    </motion.div>
  )
}

// ── 3D Enter Orb ──────────────────────────────────────────────────────────────
function EnterOrb({ hovered }: { hovered: boolean }) {
  const torusRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.4
      torusRef.current.rotation.z = t * 0.22
    }
    if (ringRef.current) {
      ringRef.current.rotation.y = t * 0.6
    }
  })

  return (
    <group scale={hovered ? 1.08 : 1}>
      <mesh ref={torusRef}>
        <torusGeometry args={[1, 0.32, 24, 80]} />
        <meshStandardMaterial color="#050505" emissive="#ADFF2F" emissiveIntensity={hovered ? 0.7 : 0.3} roughness={0.1} metalness={0.9} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.6, 0.012, 8, 100]} />
        <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={hovered ? 2.5 : 1.0} transparent opacity={0.8} />
      </mesh>
      <mesh rotation={[0, Math.PI / 4, 0]}>
        <torusGeometry args={[0.75, 0.008, 8, 80]} />
        <meshStandardMaterial color="#ADFF2F" emissive="#ADFF2F" emissiveIntensity={hovered ? 2.0 : 0.8} transparent opacity={0.6} />
      </mesh>
    </group>
  )
}

// ── Contact method list ────────────────────────────────────────────────────────
const contactMethods = [
  { id: 'whatsapp', icon: MessageCircle, label: 'WhatsApp', value: '+91 79870-00400', href: 'https://wa.me/7987000400', color: '#ADFF2F' },
  { id: 'email', icon: Mail, label: 'Email', value: 'connect.crazywebstudio@gmail.com', href: 'connect.crazywebstudio@gmail.com', color: '#00F0FF' },
  { id: 'call', icon: Calendar, label: 'Book a Call', value: 'Schedule a discovery session', href: '#', color: '#ADFF2F' },
  { id: 'location', icon: MapPin, label: 'Location', value: 'Indore, MP — India', href: null, color: '#00F0FF' },
]

const socials = [
  { id: 'instagram', icon: Instagram, label: 'Instagram', href: '#' },
  { id: 'linkedin', icon: Linkedin, label: 'LinkedIn', href: '#' },
  { id: 'github', icon: Github, label: 'GitHub', href: '#' },
]

// ── Shared Form Component ─────────────────────────────────────────────────────
interface ContactFormProps {
  isDark: boolean
  form: { name: string; email: string; message: string }
  sending: boolean
  sent: boolean
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent) => void
  variant?: 'desktop' | 'mobile'
}

const inputClass = (isDark: boolean) => `
  w-full px-4 py-3 rounded-xl text-sm font-inter outline-none
  border transition-all duration-200
  ${isDark
    ? 'bg-white/[0.04] border-white/8 text-white placeholder:text-white/25 focus:border-cyber-lime/50 focus:bg-white/[0.06]'
    : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'}
`

// ── Component ──────────────────────────────────────────────────────────────────
const ThePortal: React.FC = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  const [orbHovered, setOrbHovered] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [toast, setToast] = useState<ToastData | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (sending) return
    setSending(true)

    try {
      const res = await axios.post(`${API_BASE_URL}/api/contact`, {
        name: form.name,
        email: form.email,
        message: form.message,
      }, {
        headers: { 'Content-Type': 'application/json' },
      })

      if (res.status === 201) {
        setSent(true)
        setForm({ name: '', email: '', message: '' })
        setToast({ type: 'success', message: 'Lead captured in hyperspace! 🚀' })
        setTimeout(() => setSent(false), 4000)
      }
    } catch (err: any) {
      console.error('Contact API Error:', err)
      const errorMsg = err.response?.data?.error || 'Transmission failed. Try again.'
      setToast({ type: 'error', message: errorMsg })
    } finally {
      setSending(false)
    }
  }

  const slideLeft = {
    hidden: { opacity: 0, x: -32 },
    visible: (i: number) => ({
      opacity: 1, x: 0,
      transition: { duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
    }),
  }
  const slideRight = {
    hidden: { opacity: 0, x: 32 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <section
      id="contact"
      className={`
        snap-section relative flex items-center overflow-hidden
        bg-grid
        ${isDark ? 'bg-black' : 'bg-slate-50'}
      `}
      ref={ref}
    >
      {/* ── Grid contrast boost ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? 'linear-gradient(rgba(173,255,47,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(173,255,47,0.025) 1px, transparent 1px)'
            : 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Top lime glow ── */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[240px] pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse, rgba(173,255,47,0.07) 0%, transparent 70%)'
            : 'radial-gradient(ellipse, rgba(79,70,229,0.05) 0%, transparent 70%)',
        }}
      />

      {/* ── Success glow effect ── */}
      <AnimatePresence>
        {sent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 pointer-events-none z-[2]"
            style={{
              background: 'radial-gradient(ellipse 50% 50% at 75% 50%, rgba(173,255,47,0.08) 0%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* ── DESKTOP: split layout ── */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-0 relative z-10 w-full h-full pt-16">

        {/* ── LEFT: Text + Contacts ── */}
        <div className="flex flex-col justify-center px-16 xl:px-24 py-12 border-r border-white/5">
          <motion.div variants={slideLeft} custom={0} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
            <p className="section-label mb-4">The Portal</p>
            <h2 className={`font-outfit font-black leading-[0.93] text-5xl xl:text-6xl mb-5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Ready to enter<br />the{' '}<span className="gradient-text glow-lime">3rd Dimension?</span>
            </h2>
            <p className={`font-inter text-sm leading-relaxed mb-8 max-w-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
              We're based in Indore and work with ambitious brands who want the first 3D web
              experience their competitors can't copy. We respond in 24 hours.
            </p>
          </motion.div>

          {/* Contact methods */}
          <div className="flex flex-col gap-1 mb-8">
            {contactMethods.map((c, i) => (
              <motion.div key={c.id} variants={slideLeft} custom={i + 1} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
                {c.href ? (
                  <a href={c.href} id={`portal-${c.id}`} className={`flex items-center gap-4 px-4 py-3 rounded-xl group transition-all duration-200 ${isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-white hover:shadow-sm'}`}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200" style={{ background: `${c.color}14`, color: c.color }}><c.icon size={16} /></div>
                    <div className="flex-1">
                      <p className={`font-inter text-[11px] ${isDark ? 'text-white/30' : 'text-gray-400'}`}>{c.label}</p>
                      <p className={`font-outfit font-semibold text-sm ${isDark ? 'text-white/80' : 'text-gray-800'}`}>{c.value}</p>
                    </div>
                    <ArrowRight size={14} className={`opacity-0 group-hover:opacity-50 transition-opacity ${isDark ? 'text-white' : 'text-gray-400'}`} />
                  </a>
                ) : (
                  <div className="flex items-center gap-4 px-4 py-3 rounded-xl">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${c.color}14`, color: c.color }}><c.icon size={16} /></div>
                    <div>
                      <p className={`font-inter text-[11px] ${isDark ? 'text-white/30' : 'text-gray-400'}`}>{c.label}</p>
                      <p className={`font-outfit font-semibold text-sm ${isDark ? 'text-white/80' : 'text-gray-800'}`}>{c.value}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Socials */}
          <motion.div variants={slideLeft} custom={5} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="flex items-center gap-2 px-4">
            {socials.map(s => (
              <a key={s.id} href={s.href} id={`social-${s.id}`} aria-label={s.label} className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-200 hover:scale-110 ${isDark ? 'border-white/10 text-white/35 hover:border-cyber-lime/50 hover:text-cyber-lime' : 'border-gray-200 text-gray-400 hover:border-indigo-400 hover:text-indigo-500'}`}>
                <s.icon size={15} />
              </a>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT: 3D Orb + Form ── */}
        <div className="flex flex-col justify-center px-12 xl:px-16 py-12 gap-8">
          {/* 3D Interactive Orb */}
          <motion.div variants={slideRight} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="w-full" style={{ height: '220px' }}>
            <div
              className={`relative w-full h-full rounded-2xl overflow-hidden cursor-pointer group border transition-all duration-300 ${isDark ? orbHovered ? 'border-cyber-lime/40' : 'border-white/6' : orbHovered ? 'border-indigo-400/40' : 'border-gray-200'}`}
              onMouseEnter={() => setOrbHovered(true)}
              onMouseLeave={() => setOrbHovered(false)}
              style={orbHovered ? { boxShadow: isDark ? '0 0 50px rgba(173,255,47,0.15)' : '0 0 30px rgba(79,70,229,0.1)' } : {}}
            >
              <Canvas camera={{ position: [0, 0, 5], fov: 40 }} gl={{ antialias: true, alpha: true }} className="no-transition">
                <Suspense fallback={null}>
                  <ambientLight intensity={isDark ? 0.1 : 0.3} />
                  <pointLight position={[3, 3, 3]} intensity={isDark ? 2 : 1} color="#ADFF2F" />
                  <pointLight position={[-3, -2, 2]} intensity={isDark ? 1 : 0.5} color="#00F0FF" />
                  <EnterOrb hovered={orbHovered} />
                </Suspense>
              </Canvas>
              <AnimatePresence>
                {orbHovered && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-outfit font-bold text-sm ${isDark ? 'bg-black/60 text-cyber-lime border border-cyber-lime/30' : 'bg-white/70 text-indigo-600 border border-indigo-300'} backdrop-blur-md`}>
                      <Zap size={14} />Launch Project
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Contact Form — Desktop */}
          <motion.form variants={slideRight} initial="hidden" animate={inView ? 'visible' : 'hidden'} onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <input id="portal-name" name="name" type="text" placeholder="Your Name" value={form.name} onChange={handleChange} required className={inputClass(isDark)} />
              <input id="portal-email" name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange} required className={inputClass(isDark)} />
            </div>
            <textarea id="portal-message" name="message" placeholder="Describe your project vision..." rows={4} value={form.message} onChange={handleChange} required className={`${inputClass(isDark)} resize-none`} />
            <button id="portal-submit" type="submit" disabled={sending || sent} className={`btn-primary w-full justify-center transition-all duration-200 ${sending || sent ? 'opacity-70 cursor-not-allowed' : ''} ${sent ? '!bg-cyber-lime/80' : ''}`}>
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.span key="sent" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <CheckCircle2 size={15} /> Lead Captured!
                  </motion.span>
                ) : sending ? (
                  <motion.span key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Loader2 size={15} className="animate-spin" /> Transmitting...
                  </motion.span>
                ) : (
                  <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Send size={15} /> Send Message
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </motion.form>
        </div>
      </div>

      {/* ── MOBILE: stacked layout ── */}
      <div className="lg:hidden relative z-10 w-full px-6 pt-20 pb-12 flex flex-col gap-8">
        <div>
          <p className="section-label mb-3">The Portal</p>
          <h2 className={`font-outfit font-black text-4xl leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Ready to enter<br />the{' '}<span className="gradient-text">3rd Dimension?</span>
          </h2>
        </div>

        <div className="flex flex-col gap-2">
          {contactMethods.filter(c => c.href).map(c => (
            <a key={c.id} href={c.href!} className={`flex items-center gap-4 w-full px-5 py-4 rounded-xl border transition-all duration-200 active:scale-[0.98] ${isDark ? 'bg-white/[0.04] border-white/8' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${c.color}18`, color: c.color }}><c.icon size={18} /></div>
              <div className="flex-1">
                <p className={`font-inter text-xs ${isDark ? 'text-white/30' : 'text-gray-400'}`}>{c.label}</p>
                <p className={`font-outfit font-semibold text-sm ${isDark ? 'text-white/80' : 'text-gray-800'}`}>{c.value}</p>
              </div>
              <ArrowRight size={15} className={isDark ? 'text-white/30' : 'text-gray-300'} />
            </a>
          ))}
        </div>

        {/* Form — mobile */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input name="name" type="text" placeholder="Your Name" value={form.name} onChange={handleChange} required className={`${inputClass(isDark)} !py-3.5`} />
          <input name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange} required className={`${inputClass(isDark)} !py-3.5`} />
          <textarea name="message" placeholder="Describe your project..." rows={4} value={form.message} onChange={handleChange} required className={`${inputClass(isDark)} !py-3.5 resize-none`} />
          <button type="submit" disabled={sending || sent} className="btn-primary w-full justify-center">
            {sent ? <><CheckCircle2 size={15} /> Lead Captured!</> : sending ? <><Loader2 size={15} className="animate-spin" /> Transmitting...</> : <><Send size={15} /> Send Message</>}
          </button>
        </form>

        <div className="flex gap-3">
          {socials.map(s => (
            <a key={s.id} href={s.href} aria-label={s.label} className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-200 ${isDark ? 'border-white/10 text-white/35 hover:border-cyber-lime/50 hover:text-cyber-lime' : 'border-gray-200 text-gray-400 hover:border-indigo-400 hover:text-indigo-500'}`}>
              <s.icon size={16} />
            </a>
          ))}
        </div>
      </div>

      {/* ── Neon Toast Notification ── */}
      <AnimatePresence>
        {toast && <NeonToast toast={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </section>
  )
}

export default ThePortal
