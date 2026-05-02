import React from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, ArrowUpRight, Github } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import SnapSection from './SnapSection'

interface Project {
  id: string
  title: string
  category: string
  description: string
  techStack: string[]
  image: string
  link?: string
  github?: string
  color: string
}

const projects: Project[] = [
  {
    id: 'proj-aurum',
    title: 'Aurum Hotel OS',
    category: 'SaaS Platform',
    description: 'A luxury booking and management platform with real-time room availability, advanced pricing engine, and concierge dashboards.',
    techStack: ['Next.js', 'tRPC', 'PostgreSQL', 'Tailwind'],
    image: 'radial-gradient(circle at 50% 50%, #1A1A24, #000000)',
    color: '#00F0FF'
  },
  {
    id: 'proj-codementor',
    title: 'CodeMentor AI',
    category: 'AI Application',
    description: 'An intelligent coding assistant featuring a progressive hint system, anti-cheat mechanisms, and real-time streaming feedback.',
    techStack: ['React', 'Node.js', 'Gemini AI', 'WebSockets'],
    image: 'radial-gradient(circle at 50% 50%, #182010, #000000)',
    color: '#ADFF2F'
  },
  {
    id: 'proj-staysphere',
    title: 'StaySphere',
    category: 'Web App',
    description: 'A full-stack property rental application with complex CRUD operations, booking endpoints, and a comprehensive admin dashboard.',
    techStack: ['MERN Stack', 'Express', 'MongoDB', 'Redux'],
    image: 'radial-gradient(circle at 50% 50%, #101820, #000000)',
    color: '#00F0FF'
  },
  {
    id: 'proj-movie',
    title: 'Movie Deal Finder',
    category: 'AI Automation',
    description: 'An AI-powered movie ticket deal finder utilizing natural language processing to extract intents and rank real-time prices.',
    techStack: ['React', 'Express', 'OpenAI', 'Tailwind'],
    image: 'radial-gradient(circle at 50% 50%, #201810, #000000)',
    color: '#ADFF2F'
  }
]

const OurWorkSection: React.FC = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <SnapSection
      id="our-work"
      className={`
        justify-center py-24 overflow-hidden relative
        ${isDark ? 'bg-black' : 'bg-slate-50'}
      `}
    >
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 rounded-full pointer-events-none opacity-[0.03]"
        style={{ background: 'radial-gradient(circle, #ADFF2F, transparent)' }} />

      <div className="relative z-10 container mx-auto px-6 lg:px-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-label mb-4">Portfolio · Case Studies</p>
            <h2 className={`font-outfit font-black text-4xl lg:text-5xl leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Our <span className="gradient-text">Work.</span>
            </h2>
            <p className={`font-inter text-base mt-4 max-w-xl ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
              A curated selection of our most complex architectural builds, from 3D spatial experiences to AI-powered SaaS platforms.
            </p>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="btn-outline text-sm px-6 py-2.5 h-fit whitespace-nowrap"
          >
            View GitHub
            <Github size={16} />
          </motion.button>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className={`
                glass-card h-full overflow-hidden flex flex-col border transition-all duration-300
                ${isDark ? 'border-white/5 hover:border-white/20' : 'border-black/5 hover:border-black/20'}
              `}>
                {/* Visual Placeholder (Could be an actual image or 3D canvas later) */}
                <div 
                  className="w-full h-48 lg:h-60 relative overflow-hidden flex items-center justify-center border-b border-white/5"
                  style={{ background: project.image }}
                >
                  <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
                  
                  {/* Subtle hover overlay effect */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-md translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <ArrowUpRight className="text-white" size={24} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 lg:p-8 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-inter uppercase tracking-wider px-2.5 py-1 rounded-full ${isDark ? 'bg-white/10 text-white/70' : 'bg-black/5 text-gray-600'}`}>
                      {project.category}
                    </span>
                  </div>
                  
                  <h3 className={`font-outfit font-bold text-2xl mb-3 transition-colors ${isDark ? 'text-white group-hover:text-cyber-lime' : 'text-gray-900 group-hover:text-indigo-600'}`}>
                    {project.title}
                  </h3>
                  
                  <p className={`font-inter text-sm mb-6 flex-grow ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.techStack.map(tech => (
                      <span key={tech} className="tech-badge">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SnapSection>
  )
}

export default OurWorkSection
