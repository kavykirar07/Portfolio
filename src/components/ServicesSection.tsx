import React from 'react'
import { motion } from 'framer-motion'
import { Box, Cpu, Palette, Zap, ArrowUpRight } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import SnapSection from './SnapSection'

interface Service {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  tags: string[]
  accent: string
}

const services: Service[] = [
  {
    id: 'service-3d',
    icon: <Box size={24} />,
    title: 'Immersive 3D Experiences',
    description:
      'Full-GPU interactive websites built with Three.js & R3F. Explorable 3D environments, physics-reactive elements, and scroll-driven storytelling that breaks the 2D barrier.',
    tags: ['Three.js', 'R3F', 'WebGL', 'GSAP'],
    accent: '#ADFF2F',
  },
  {
    id: 'service-spatial',
    icon: <Palette size={24} />,
    title: 'Spatial UI / UX Design',
    description:
      'Interfaces designed for the next dimension of computing. Glassmorphism, Z-axis depth, mouse-reactive parallax, and motion-first design systems that feel alive.',
    tags: ['Figma', 'Framer Motion', 'Spline', 'Design Systems'],
    accent: '#00F0FF',
  },
  {
    id: 'service-ai',
    icon: <Cpu size={24} />,
    title: 'AI-Powered Automation',
    description:
      'OpenAI-integrated chatbots, n8n automated workflows, and custom AI models embedded into your web platform — turning your site into a 24/7 lead-conversion machine.',
    tags: ['OpenAI', 'n8n', 'Node.js', 'MongoDB'],
    accent: '#ADFF2F',
  },
  {
    id: 'service-brand',
    icon: <Zap size={24} />,
    title: 'Brand Identity 3.0',
    description:
      'Futuristic motion-first brand systems for the modern web. Logo reveals, kinetic typography, and visual assets built to dominate social feeds and first impressions.',
    tags: ['Motion Graphics', 'GSAP', 'SVG Animation', 'Identity'],
    accent: '#00F0FF',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
}

const ServicesSection: React.FC = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <SnapSection
      id="services"
      className={`
        justify-center py-24
        ${isDark ? 'bg-black' : 'bg-slate-50'}
        bg-grid
      `}
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 50% 50% at 20% 80%, rgba(0,240,255,0.04) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 50% 50% at 20% 80%, rgba(79,70,229,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 container mx-auto px-6 lg:px-16">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="section-label mb-4">What We Deliver</p>
          <h2 className={`font-outfit font-black text-4xl lg:text-5xl xl:text-6xl leading-tight mb-5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Services That{' '}
            <span className="gradient-text">Obliterate</span>
            <br />
            the Competition.
          </h2>
          <p className={`font-inter text-base lg:text-lg leading-relaxed ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
            Every deliverable is engineered to hit a performance budget and a visual WOW moment.
            No templates. No compromise.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              id={service.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="glass-card p-7 group cursor-default relative overflow-hidden"
            >
              {/* Glow on hover (handled by CSS .glass-card:hover) */}
              {/* Icon */}
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `${service.accent}18`,
                  border: `1px solid ${service.accent}30`,
                  color: service.accent,
                }}
              >
                {service.icon}
              </div>

              {/* Title + arrow */}
              <div className="flex items-start justify-between mb-3">
                <h3 className={`font-outfit font-bold text-xl leading-snug ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {service.title}
                </h3>
                <ArrowUpRight
                  size={18}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1 ml-2 flex-shrink-0"
                  style={{ color: service.accent }}
                />
              </div>

              {/* Description */}
              <p className={`font-inter text-sm leading-relaxed mb-5 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                {service.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`
                      px-2.5 py-1 rounded-full text-xs font-inter font-medium
                      ${isDark
                        ? 'bg-white/5 text-white/40 border border-white/5'
                        : 'bg-gray-100 text-gray-500 border border-gray-200'}
                    `}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SnapSection>
  )
}

export default ServicesSection
