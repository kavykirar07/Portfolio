import React from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <motion.button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      className={`
        relative flex items-center gap-2 px-3 py-2 rounded-full
        border text-sm font-inter font-medium
        transition-all duration-300
        ${isDark
          ? 'bg-surface-dark border-white/10 text-white/70 hover:border-cyber-lime/40 hover:text-cyber-lime'
          : 'bg-white/80 border-black/10 text-gray-600 hover:border-indigo-400 hover:text-indigo-600'}
      `}
      whileTap={{ scale: 0.92 }}
      aria-label="Toggle theme"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {isDark ? <Sun size={15} /> : <Moon size={15} />}
      </motion.div>
      <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
    </motion.button>
  )
}

export default ThemeToggle
