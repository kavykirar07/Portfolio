import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Star, MapPin, ExternalLink, ChevronRight, X, Eye } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import SnapSection from './SnapSection'

interface FoodItem {
  id: string
  emoji: string
  name: string
  restaurant: string
  category: string
  price: string
  rating: number
  description: string
  delay: number
  color: string
}

const foodItems: FoodItem[] = [
  {
    id: 'food-poha',
    emoji: '🍲',
    name: 'Indori Poha',
    restaurant: 'Sarafa Bazaar',
    category: 'Breakfast',
    price: '₹40',
    rating: 4.9,
    description: 'The city\'s signature dish. Fluffy, fennel-kissed poha topped with sev, onions & a squeeze of lemon.',
    delay: 0,
    color: '#ADFF2F',
  },
  {
    id: 'food-dal-bafla',
    emoji: '🫕',
    name: 'Dal Bafla',
    restaurant: 'Vijay Chat',
    category: 'Main Course',
    price: '₹120',
    rating: 4.8,
    description: 'Rajasthani-influenced baked wheat balls dunked in rich, spiced dal. Heritage on a plate.',
    delay: 0.1,
    color: '#00F0FF',
  },
  {
    id: 'food-joshi',
    emoji: '🍫',
    name: 'Gulab Jamun',
    restaurant: 'Joshi Dahi Bada',
    category: 'Dessert',
    price: '₹35',
    rating: 4.9,
    description: 'Legendary for 80+ years. Melt-in-your-mouth jamuns from Indore\'s most iconic dessert house.',
    delay: 0.2,
    color: '#ADFF2F',
  },
  {
    id: 'food-garadu',
    emoji: '🫚',
    name: 'Garadu',
    restaurant: 'Chappan Dukan',
    category: 'Street Food',
    price: '₹60',
    rating: 4.7,
    description: 'Deep-fried yam cubes seasoned with chaat masala and raw mango powder. Peak winter street food.',
    delay: 0.3,
    color: '#00F0FF',
  },
  {
    id: 'food-shikanji',
    emoji: '🍋',
    name: 'Shikanji',
    restaurant: 'Johny Hot Dog',
    category: 'Beverage',
    price: '₹25',
    rating: 4.6,
    description: 'Indore\'s legendary lemon soda — spiced, salty, tangy, and utterly addictive on a summer afternoon.',
    delay: 0.4,
    color: '#ADFF2F',
  },
  {
    id: 'food-bhutte-ka-kees',
    emoji: '🌽',
    name: 'Bhutte Ka Kees',
    restaurant: 'Sarafa Night Market',
    category: 'Snack',
    price: '₹50',
    rating: 4.8,
    description: 'Grated corn cooked in milk and spices. A creamy, aromatic dish found nowhere else on earth.',
    delay: 0.5,
    color: '#00F0FF',
  },
]

/* ── 3D Tilt Card ─────────────────────────────────────────────── */
interface TiltCardProps {
  item: FoodItem
  isDark: boolean
  isActive: boolean
  onSelect: () => void
  onPreview: () => void
}

const TiltCard: React.FC<TiltCardProps> = ({ item, isDark, isActive, onSelect, onPreview }) => {
  const cardRef = useRef<HTMLDivElement>(null)

  // Mouse position motion values for 3D tilt
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Transform mouse to rotation (spring-smoothed)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), {
    stiffness: 250,
    damping: 25,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), {
    stiffness: 250,
    damping: 25,
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      id={item.id}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: item.delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      className={`
        text-left glass-card p-4 relative overflow-hidden group cursor-pointer
        ${isActive
          ? isDark ? 'border-cyber-lime/40' : 'border-indigo-400/40'
          : ''}
      `}
    >
      {/* Anti-gravity floating emoji */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{
          repeat: Infinity,
          duration: 3 + item.delay,
          ease: 'easeInOut',
          delay: item.delay,
        }}
        className="text-4xl mb-3"
        style={{ transform: 'translateZ(30px)' }}
      >
        {item.emoji}
      </motion.div>

      {/* Content */}
      <h3
        className={`font-outfit font-bold text-base mb-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}
        style={{ transform: 'translateZ(20px)' }}
      >
        {item.name}
      </h3>
      <p className={`font-inter text-xs mb-2 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
        {item.restaurant}
      </p>

      {/* Rating + Price */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Star size={11} fill="#ADFF2F" className="text-cyber-lime" />
          <span className={`font-inter text-xs font-medium ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
            {item.rating}
          </span>
        </div>
        <span
          className="font-outfit font-bold text-sm"
          style={{ color: item.color }}
        >
          {item.price}
        </span>
      </div>

      {/* Category badge */}
      <span className={`
        absolute top-3 right-3
        text-[10px] font-inter px-2 py-0.5 rounded-full
        ${isDark ? 'bg-white/5 text-white/30' : 'bg-gray-100 text-gray-400'}
      `}>
        {item.category}
      </span>

      {/* Interactive Preview button */}
      <motion.button
        onClick={(e) => { e.stopPropagation(); onPreview() }}
        className={`
          absolute bottom-3 right-3 flex items-center gap-1
          text-[10px] font-inter font-medium px-2.5 py-1 rounded-full
          opacity-0 group-hover:opacity-100 transition-all duration-200
          ${isDark
            ? 'bg-cyber-lime/10 text-cyber-lime border border-cyber-lime/20 hover:bg-cyber-lime/20'
            : 'bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100'}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Eye size={10} />
        3D Preview
      </motion.button>

      {/* Hover chevron */}
      <ChevronRight
        size={14}
        className={`
          absolute bottom-4 left-4 transition-all duration-200
          opacity-0 group-hover:opacity-60 translate-x-0 group-hover:translate-x-1
          ${isDark ? 'text-white' : 'text-gray-500'}
        `}
      />
    </motion.div>
  )
}

/* ── Glassmorphic 3D Preview Modal ───────────────────────────── */
interface PreviewModalProps {
  item: FoodItem
  isDark: boolean
  onClose: () => void
}

const PreviewModal: React.FC<PreviewModalProps> = ({ item, isDark, onClose }) => {
  return (
    <motion.div
      className="glass-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="glass-modal"
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 30 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{item.emoji}</span>
            <div>
              <h3 className={`font-outfit font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {item.name}
              </h3>
              <p className={`font-inter text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                {item.restaurant} · {item.category}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${isDark ? 'text-white/40 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
          >
            <X size={18} />
          </button>
        </div>

        {/* 3D Preview Area */}
        <div className="relative h-[280px] flex items-center justify-center overflow-hidden">
          {/* Animated 3D emoji placeholder with physics */}
          <motion.div
            className="text-[120px] select-none"
            animate={{
              y: [0, -15, 0],
              rotateZ: [0, 3, -3, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: 'easeInOut',
            }}
          >
            {item.emoji}
          </motion.div>

          {/* Glow rings */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${item.color}15 0%, transparent 60%)`,
            }}
          />

          {/* Grid overlay */}
          <div className="absolute inset-0 pointer-events-none bg-grid opacity-30" />

          {/* Status indicator */}
          <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-inter font-medium
            ${isDark ? 'bg-white/5 text-cyber-lime border border-cyber-lime/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-200'}
          `}>
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-lime animate-pulse" />
            3D Model — Coming in Phase 3
          </div>
        </div>

        {/* Info */}
        <div className="px-6 py-4 border-t border-white/10">
          <p className={`font-inter text-sm leading-relaxed ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
            {item.description}
          </p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1">
              <Star size={14} fill={item.color} style={{ color: item.color }} />
              <span className={`font-inter text-sm font-medium ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                {item.rating}
              </span>
            </div>
            <span
              className="font-outfit font-black text-xl"
              style={{ color: item.color }}
            >
              {item.price}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Main Food Guide Section ─────────────────────────────────── */
const FoodGuideSection: React.FC = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [activeItem, setActiveItem] = useState<FoodItem | null>(null)
  const [previewItem, setPreviewItem] = useState<FoodItem | null>(null)

  return (
    <SnapSection
      id="food-guide"
      className={`
        justify-center py-24 overflow-hidden
        ${isDark ? 'bg-[#030303]' : 'bg-white'}
      `}
    >
      {/* Decorative orbs */}
      <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full pointer-events-none opacity-10"
        style={{ background: 'radial-gradient(circle, #ADFF2F, transparent)' }} />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full pointer-events-none opacity-10"
        style={{ background: 'radial-gradient(circle, #00F0FF, transparent)' }} />

      <div className="relative z-10 container mx-auto px-6 lg:px-16">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <p className="section-label mb-4">Flagship Prototype · Phase 3</p>
            <h2 className={`font-outfit font-black text-4xl lg:text-5xl xl:text-6xl leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              The 3D Indore{' '}
              <span className="gradient-text">Food Guide.</span>
            </h2>
            <p className={`font-inter text-sm mt-3 flex items-center gap-1.5 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
              <MapPin size={13} />
              Indore, Madhya Pradesh — Street Food Capital of India
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-inter px-3 py-1.5 rounded-full border ${isDark ? 'border-cyber-lime/30 text-cyber-lime' : 'border-indigo-300 text-indigo-600'}`}>
              Interactive Preview
            </span>
            <button
              id="food-guide-launch-btn"
              className="btn-primary text-sm px-5 py-2.5"
            >
              Full Experience Soon
              <ExternalLink size={14} />
            </button>
          </div>
        </div>

        {/* Food Cards Grid — with 3D Tilt */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4" style={{ perspective: '1200px' }}>
          {foodItems.map((item) => (
            <TiltCard
              key={item.id}
              item={item}
              isDark={isDark}
              isActive={activeItem?.id === item.id}
              onSelect={() => setActiveItem(activeItem?.id === item.id ? null : item)}
              onPreview={() => setPreviewItem(item)}
            />
          ))}
        </div>

        {/* Expanded Detail Panel */}
        <AnimatePresence>
          {activeItem && (
            <motion.div
              key={activeItem.id + '-detail'}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden mt-4"
            >
              <div
                className="glass-card p-6 flex items-start gap-5"
                style={{ borderColor: `${activeItem.color}30` }}
              >
                <div
                  className="text-5xl flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-2xl"
                  style={{ background: `${activeItem.color}12` }}
                >
                  {activeItem.emoji}
                </div>
                <div className="flex-1">
                  <h4 className={`font-outfit font-bold text-xl mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {activeItem.name}
                  </h4>
                  <p className={`font-inter text-xs mb-3 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                    {activeItem.restaurant} · {activeItem.category}
                  </p>
                  <p className={`font-inter text-sm leading-relaxed ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                    {activeItem.description}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-outfit font-black text-2xl" style={{ color: activeItem.color }}>
                    {activeItem.price}
                  </p>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <Star size={12} fill={activeItem.color} style={{ color: activeItem.color }} />
                    <span className={`font-inter text-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                      {activeItem.rating}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA note */}
        <p className={`text-center text-xs font-inter mt-8 ${isDark ? 'text-white/25' : 'text-gray-300'}`}>
          Full 3D experience with physics-reactive food models launching in Phase 3 · Week 3–4
        </p>
      </div>

      {/* Glassmorphic 3D Preview Modal */}
      <AnimatePresence>
        {previewItem && (
          <PreviewModal
            item={previewItem}
            isDark={isDark}
            onClose={() => setPreviewItem(null)}
          />
        )}
      </AnimatePresence>
    </SnapSection>
  )
}

export default FoodGuideSection
