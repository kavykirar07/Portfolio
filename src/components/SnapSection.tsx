import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface SnapSectionProps {
  id: string
  children: ReactNode
  className?: string
}

/* ── Scale & Fade Transition ─────────────────────────────────
   As a section exits, it scales down (0.9) and fades.
   As the incoming section enters, it scales up to 1.
   Uses whileInView + viewport for scroll-driven triggering.
   ─────────────────────────────────────────────────────────── */
const sectionVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const SnapSection: React.FC<SnapSectionProps> = ({ id, children, className = '' }) => {
  return (
    <motion.section
      id={id}
      className={`snap-section relative flex flex-col ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
      variants={sectionVariants}
      style={{ transformOrigin: 'center center' }}
    >
      {children}
    </motion.section>
  )
}

export default SnapSection
