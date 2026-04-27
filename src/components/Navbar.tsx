import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import ThemeToggle from './ThemeToggle'

interface NavLink {
  label: string
  href: string
}

const navLinks: NavLink[] = [
  { label: 'Services',   href: '#services' },
  { label: 'Food Guide', href: '#food-guide' },
  { label: 'Team',       href: '#team' },
  { label: 'Contact',    href: '#contact' },
]

const Navbar: React.FC = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <>
      <motion.nav
        id="navbar"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={`
          fixed top-0 left-0 right-0 z-50
          flex items-center justify-between
          px-6 lg:px-16 h-16
          transition-all duration-300
          ${scrolled
            ? isDark
              ? 'glass border-b border-white/5 backdrop-blur-[15px]'
              : 'bg-white/80 backdrop-blur-[15px] border-b border-black/5 shadow-sm'
            : 'bg-transparent'
          }
        `}
      >
        {/* Logo */}
        <button
          onClick={() => scrollToSection('#hero')}
          className="flex items-center gap-2 group"
          id="nav-logo"
        >
          <div className={`
            w-8 h-8 rounded-lg flex items-center justify-center
            ${isDark ? 'bg-cyber-lime' : 'bg-gray-900'}
            group-hover:scale-110 transition-transform duration-200
          `}>
            <Zap size={16} className={isDark ? 'text-black' : 'text-white'} fill="currentColor" />
          </div>
          <span className={`
            font-outfit font-black text-lg tracking-tight
            ${isDark ? 'text-white' : 'text-gray-900'}
          `}>
            Crazy<span className="gradient-text">Web</span>
            <span className={isDark ? 'text-white/50' : 'text-gray-400'}>.Studio</span>
          </span>
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.href)}
              className={`
                font-inter text-sm font-medium tracking-wide
                transition-colors duration-200
                ${isDark
                  ? 'text-white/50 hover:text-white'
                  : 'text-gray-500 hover:text-gray-900'}
              `}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => scrollToSection('#contact')}
            className="hidden md:flex btn-primary text-sm px-5 py-2.5"
            id="nav-cta-btn"
          >
            Let's Build
          </button>
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 rounded-lg ${isDark ? 'text-white/70' : 'text-gray-600'}`}
            id="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={menuOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={`
              fixed top-16 left-0 right-0 z-40
              ${isDark ? 'glass border-b border-white/5' : 'bg-white/95 backdrop-blur-xl border-b border-black/5'}
              flex flex-col gap-1 px-6 py-4 md:hidden
            `}
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => scrollToSection(link.href)}
                className={`
                  text-left py-3 font-inter font-medium text-sm border-b
                  ${isDark ? 'text-white/70 border-white/5 hover:text-white' : 'text-gray-600 border-gray-100 hover:text-gray-900'}
                `}
              >
                {link.label}
              </motion.button>
            ))}
            <button
              onClick={() => scrollToSection('#contact')}
              className="btn-primary mt-3 w-full justify-center"
            >
              Let's Build
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
