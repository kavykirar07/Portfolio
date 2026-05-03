import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Github, Play, ArrowUpRight } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import SnapSection from './SnapSection'
import LivePreviewModal from './LivePreviewModal'

interface Project {
  id: string
  title: string
  category: string
  description: string
  techStack: string[]
  image: string
  liveUrl?: string
  github?: string
  color: string
}

const projects: Project[] = [
  {
    id: 'proj-aurum',
    title: 'Aurum Hotel OS',
    category: 'SaaS Platform',
    description:
      'A luxury booking and management platform with real-time room availability, advanced pricing engine, and concierge dashboards.',
    techStack: ['Next.js', 'tRPC', 'PostgreSQL', 'Tailwind'],
    image: 'radial-gradient(circle at 50% 50%, #1A1A24, #000000)',
    liveUrl: 'https://aurum-hotel-silk.vercel.app/',
    github: 'https://github.com',
    color: '#00F0FF',
  },
  {
    id: 'proj-codementor',
    title: 'CodeMentor AI',
    category: 'AI Application',
    description:
      'An intelligent coding assistant featuring a progressive hint system, anti-cheat mechanisms, and real-time streaming feedback.',
    techStack: ['React', 'Node.js', 'Gemini AI', 'WebSockets'],
    image: 'radial-gradient(circle at 50% 50%, #182010, #000000)',
    liveUrl: 'https://code-mentor-ai-chi.vercel.app/',
    github: 'https://github.com',
    color: '#ADFF2F',
  },
  {
    id: 'proj-cafeco',
    title: 'CAFE co.',
    category: 'Landing Page',
    description:
      'A high-end landing page designed to bridge the gap between physical spaces and digital interfaces — Brutalist-Chic aesthetic.',
    techStack: ['HTML', 'Vite', 'Vanilla CSS', 'GSAP'],
    image: 'radial-gradient(circle at 50% 50%, #101820, #000000)',
    liveUrl: 'https://cafe-co-wine.vercel.app/',
    github: 'https://github.com',
    color: '#00F0FF',
  },
  {
    id: 'proj-movie',
    title: 'Movie Deal Finder',
    category: 'AI Automation',
    description:
      'An AI-powered movie ticket deal finder utilizing natural language processing to extract intents and rank real-time prices.',
    techStack: ['React', 'Express', 'OpenAI', 'Tailwind'],
    image: 'radial-gradient(circle at 50% 50%, #201810, #000000)',
    liveUrl: 'https://movie-deal-finder.vercel.app/',
    github: 'https://github.com',
    color: '#ADFF2F',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const OurWorkSection: React.FC = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [previewProject, setPreviewProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openPreview = useCallback((project: Project) => {
    if (!project.liveUrl) return
    setPreviewProject(project)
    setIsModalOpen(true)
  }, [])

  const closePreview = useCallback(() => {
    setIsModalOpen(false)
    // Delay clearing project so exit animation plays cleanly
    setTimeout(() => setPreviewProject(null), 400)
  }, [])

  return (
    <>
      <SnapSection
        id="our-work"
        className={`
          justify-center py-24 overflow-hidden relative
          ${isDark ? 'bg-black' : 'bg-slate-50'}
        `}
      >
        {/* Background accents */}
        <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div
          className="absolute bottom-1/4 left-0 w-96 h-96 rounded-full pointer-events-none opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #ADFF2F, transparent)' }}
        />
        <div
          className="absolute top-1/3 right-0 w-72 h-72 rounded-full pointer-events-none opacity-[0.02]"
          style={{ background: 'radial-gradient(circle, #00F0FF, transparent)' }}
        />

        <div className="relative z-10 container mx-auto px-6 lg:px-16">
          {/* ── Header ─────────────────────────────────── */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              <p className="section-label mb-4">Portfolio · Case Studies</p>
              <h2
                className={`font-outfit font-black text-4xl lg:text-5xl leading-tight ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Our <span className="gradient-text">Work.</span>
              </h2>
              <p
                className={`font-inter text-base mt-4 max-w-xl ${
                  isDark ? 'text-white/50' : 'text-gray-500'
                }`}
              >
                A curated selection of our most complex architectural builds, from 3D spatial
                experiences to AI-powered SaaS platforms.
              </p>
            </motion.div>

            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="btn-outline text-sm px-6 py-2.5 h-fit whitespace-nowrap"
            >
              View GitHub
              <Github size={16} />
            </motion.a>
          </div>

          {/* ── Project Grid ───────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="group relative"
              >
                <div
                  className={`
                    glass-card h-full overflow-hidden flex flex-col border transition-all duration-300
                    ${isDark ? 'border-white/5 hover:border-white/20' : 'border-black/5 hover:border-black/20'}
                  `}
                >
                  {/* ── Visual Banner ───────────────── */}
                  <div
                    className="w-full h-48 lg:h-56 relative overflow-hidden flex items-center justify-center border-b border-white/5 cursor-pointer"
                    style={{ background: project.image }}
                    onClick={() => openPreview(project)}
                    title="Click for live preview"
                  >
                    <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

                    {/* Accent glow on hover */}
                    <div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                      style={{ background: project.color }}
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="flex flex-col items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center border backdrop-blur-md"
                          style={{
                            background: `${project.color}20`,
                            borderColor: `${project.color}50`,
                          }}
                        >
                          <Play className="text-white" size={20} fill="white" />
                        </div>
                        <span className="text-white/80 text-xs font-inter font-medium tracking-wide">
                          Live Preview
                        </span>
                      </div>
                    </div>

                    {/* Category chip — top-right */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-[10px] font-inter uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md ${
                          isDark ? 'bg-black/50 text-white/70' : 'bg-white/60 text-gray-700'
                        }`}
                      >
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* ── Content ─────────────────────── */}
                  <div className="p-6 lg:p-8 flex flex-col flex-grow">
                    <h3
                      className={`font-outfit font-bold text-2xl mb-3 transition-colors ${
                        isDark
                          ? 'text-white group-hover:text-cyber-lime'
                          : 'text-gray-900 group-hover:text-indigo-600'
                      }`}
                    >
                      {project.title}
                    </h3>

                    <p
                      className={`font-inter text-sm mb-5 flex-grow leading-relaxed ${
                        isDark ? 'text-white/60' : 'text-gray-500'
                      }`}
                    >
                      {project.description}
                    </p>

                    {/* Tech badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.techStack.map(tech => (
                        <span key={tech} className="tech-badge">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* ── Action Buttons ──────────── */}
                    <div className="flex gap-3 mt-auto">
                      {/* View Code */}
                      {project.github && (
                        <a
                          id={`btn-github-${project.id}`}
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`project-btn-outline flex-1 ${
                            isDark ? 'project-btn-outline-dark' : 'project-btn-outline-light'
                          }`}
                        >
                          <Github size={14} />
                          View Code
                        </a>
                      )}

                      {/* Live Demo */}
                      {project.liveUrl && (
                        <button
                          id={`btn-live-${project.id}`}
                          onClick={() => openPreview(project)}
                          className="project-btn-primary flex-1"
                          style={{
                            background: `linear-gradient(135deg, ${project.color}20, ${project.color}10)`,
                            borderColor: `${project.color}50`,
                            color: project.color,
                          }}
                        >
                          <ArrowUpRight size={14} />
                          Live Demo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </SnapSection>

      {/* ── Live Preview Modal ─────────────────────────── */}
      {previewProject && (
        <LivePreviewModal
          isOpen={isModalOpen}
          onClose={closePreview}
          projectTitle={previewProject.title}
          liveUrl={previewProject.liveUrl!}
          accentColor={previewProject.color}
        />
      )}
    </>
  )
}

export default OurWorkSection
