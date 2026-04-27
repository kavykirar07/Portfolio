import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Mail, MessageCircle, Calendar, ArrowRight, Github, Instagram, Linkedin } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import SnapSection from './SnapSection'

const team = [
  { role: 'Lead 3D Developer', name: 'KAVY', kpi: '60fps', emoji: '🧊' },
  { role: 'Full-Stack / AI Engineer', name: 'RAJAT', kpi: 'API Uptime', emoji: '⚡' },
  { role: 'UX / Spatial Designer', name: 'PRITHVI', kpi: 'Token Compliance', emoji: '🎨' },
  { role: 'The Rainmaker', name: 'ABHISHEK', kpi: '2 Calls/Week', emoji: '💰' },
  { role: 'QA & Content', name: 'DIVYANSH', kpi: 'LH > 85', emoji: '✅' },
]

const ContactSection: React.FC = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <SnapSection
      id="contact"
      className={`justify-center py-24 ${isDark ? 'bg-black' : 'bg-slate-50'} bg-grid`}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 40% 40% at 50% 100%, rgba(173,255,47,0.05) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 40% 40% at 50% 100%, rgba(79,70,229,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 container mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: CTA */}
          <div>
            <p className="section-label mb-5">The Portal</p>
            <h2 className={`font-outfit font-black text-4xl lg:text-5xl xl:text-6xl leading-tight mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Ready to enter
              <br />
              the{' '}
              <span className="gradient-text">3rd Dimension?</span>
            </h2>
            <p className={`font-inter text-base leading-relaxed mb-10 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
              We're based in Indore and work with ambitious brands who want the first 3D web experience
              their competitors can't copy. Drop a message — we respond in 24 hours.
            </p>

            {/* Contact Methods */}
            <div className="flex flex-col gap-4 mb-10">
              {[
                { icon: <MessageCircle size={18} />, label: 'WhatsApp', value: 'Message us directly', href: 'https://wa.me/91XXXXXXXXXX', color: '#ADFF2F' },
                { icon: <Mail size={18} />, label: 'Email', value: 'hello@crazyweb.studio', href: 'mailto:hello@crazyweb.studio', color: '#00F0FF' },
                { icon: <Calendar size={18} />, label: 'Book a Call', value: 'Schedule a discovery session', href: '#', color: '#ADFF2F' },
                { icon: <MapPin size={18} />, label: 'Location', value: 'Indore, MP — India', href: null, color: '#00F0FF' },
              ].map((contact, i) => (
                <motion.div
                  key={contact.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  {contact.href ? (
                    <a
                      href={contact.href}
                      id={`contact-${contact.label.toLowerCase().replace(' ', '-')}`}
                      className={`
                        flex items-center gap-4 p-4 rounded-xl group
                        transition-all duration-200
                        ${isDark ? 'hover:bg-white/5' : 'hover:bg-white hover:shadow-sm'}
                      `}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                        style={{ background: `${contact.color}15`, color: contact.color }}
                      >
                        {contact.icon}
                      </div>
                      <div className="flex-1">
                        <p className={`font-inter text-xs mb-0.5 ${isDark ? 'text-white/35' : 'text-gray-400'}`}>{contact.label}</p>
                        <p className={`font-outfit font-semibold text-sm ${isDark ? 'text-white/80' : 'text-gray-800'}`}>{contact.value}</p>
                      </div>
                      <ArrowRight size={15} className={`opacity-0 group-hover:opacity-60 transition-opacity ${isDark ? 'text-white' : 'text-gray-400'}`} />
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 p-4 rounded-xl">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${contact.color}15`, color: contact.color }}
                      >
                        {contact.icon}
                      </div>
                      <div>
                        <p className={`font-inter text-xs mb-0.5 ${isDark ? 'text-white/35' : 'text-gray-400'}`}>{contact.label}</p>
                        <p className={`font-outfit font-semibold text-sm ${isDark ? 'text-white/80' : 'text-gray-800'}`}>{contact.value}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Social */}
            <div className="flex items-center gap-3">
              {[
                { icon: <Instagram size={16} />, label: 'Instagram', href: '#' },
                { icon: <Linkedin size={16} />, label: 'LinkedIn', href: '#' },
                { icon: <Github size={16} />, label: 'GitHub', href: '#' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  id={`social-${s.label.toLowerCase()}`}
                  aria-label={s.label}
                  className={`
                    w-10 h-10 rounded-xl flex items-center justify-center
                    border transition-all duration-200 hover:scale-110
                    ${isDark
                      ? 'border-white/10 text-white/40 hover:border-cyber-lime/40 hover:text-cyber-lime'
                      : 'border-gray-200 text-gray-400 hover:border-indigo-400 hover:text-indigo-500'}
                  `}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right: The Crazy 5 */}
          <div>
            <p className={`font-inter text-xs font-medium tracking-widest uppercase mb-6 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
              The Crazy 5 — Ownership Matrix
            </p>
            <div className="flex flex-col gap-3">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className={`
                    glass-card p-4 flex items-center gap-4
                    ${isDark ? '' : 'hover:shadow-md'}
                  `}
                >
                  <div className={`
                    text-2xl w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0
                    ${isDark ? 'bg-white/5' : 'bg-gray-50'}
                  `}>
                    {member.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-outfit font-bold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {member.name}
                    </p>
                    <p className={`font-inter text-xs truncate ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                      {member.role}
                    </p>
                  </div>
                  <span className={`
                    text-xs font-inter px-2.5 py-1 rounded-full flex-shrink-0
                    ${isDark ? 'bg-cyber-lime/10 text-cyber-lime' : 'bg-indigo-50 text-indigo-600'}
                  `}>
                    {member.kpi}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Footer note */}
            <p className={`font-inter text-xs mt-8 text-center ${isDark ? 'text-white/20' : 'text-gray-300'}`}>
              CrazyWeb.Studio · Indore, MP · Est. 2026 ·{' '}
              <span className={isDark ? 'text-cyber-lime/40' : 'text-indigo-400'}>Beyond the Scroll. Into the Space.</span>
            </p>
          </div>
        </div>
      </div>
    </SnapSection>
  )
}

export default ContactSection
