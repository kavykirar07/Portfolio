import React, { useEffect, useRef, Suspense, useCallback } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import Navbar from './components/Navbar'
import ChatbotWidget from './components/ChatbotWidget'
import Lenis from '@studio-freight/lenis'

/* ── Lazy-load heavy 3D sections ─────────────────────────────── */
const Hero3D = React.lazy(() => import('./components/Hero3D'))
const ServicesSection = React.lazy(() => import('./components/ServicesSection'))
const FoodGuideSection = React.lazy(() => import('./components/FoodGuideSection'))
const TheTeam = React.lazy(() => import('./components/TheTeam'))
const ThePortal = React.lazy(() => import('./components/ThePortal'))

/* ── Custom "Loading Dimension" Fallback ──────────────────────── */
const DimensionFallback: React.FC = () => (
  <div className="loading-dimension min-h-screen">
    Loading Dimension…
  </div>
)

/* ── Cursor-Following Glow Orb ────────────────────────────────── */
const CursorOrb: React.FC = () => {
  const orbRef = useRef<HTMLDivElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const currentPos = useRef({ x: 0, y: 0 })
  const rafId = useRef<number>(0)

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t

  const animate = useCallback(() => {
    currentPos.current.x = lerp(currentPos.current.x, mousePos.current.x, 0.08)
    currentPos.current.y = lerp(currentPos.current.y, mousePos.current.y, 0.08)

    if (orbRef.current) {
      orbRef.current.style.left = `${currentPos.current.x}px`
      orbRef.current.style.top = `${currentPos.current.y}px`
    }

    rafId.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMove)
    rafId.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      cancelAnimationFrame(rafId.current)
    }
  }, [animate])

  return <div ref={orbRef} className="cursor-orb" />
}

/* ── Main App Component ───────────────────────────────────────── */
const App: React.FC = () => {
  /* ── Lenis Smooth Scroll Setup ── */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Apple-style easing: exponential ease-out
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <ThemeProvider>
      {/* Global Animated Noise Texture Overlay (3% opacity) */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Mouse-following Radial Glow Orb */}
      <CursorOrb />

      {/* Fixed Glassmorphic Navbar */}
      <Navbar />

      {/* Main content — smooth-scrolled by Lenis */}
      <main role="main">
        {/* Section 1: Hero */}
        <Suspense fallback={<DimensionFallback />}>
          <Hero3D />
        </Suspense>

        {/* Section 2: Services */}
        <Suspense fallback={<DimensionFallback />}>
          <ServicesSection />
        </Suspense>

        {/* Section 3: Food Guide Prototype */}
        <Suspense fallback={<DimensionFallback />}>
          <FoodGuideSection />
        </Suspense>

        {/* Section 4: The Crazy 5 — Ownership Matrix */}
        <Suspense fallback={<DimensionFallback />}>
          <TheTeam />
        </Suspense>

        {/* Section 5: The Portal — Conversion */}
        <Suspense fallback={<DimensionFallback />}>
          <ThePortal />
        </Suspense>
      </main>

      {/* Persistent Floating Chatbot Widget */}
      <ChatbotWidget />
    </ThemeProvider>
  )
}

export default App
