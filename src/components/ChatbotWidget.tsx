import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const SYSTEM_GREETING = `Hello. I'm the CrazyWeb.Studio AI — built to answer one question: *how can we turn your business into a 3D spatial experience that dominates the Indore market?*

Ask me anything about our services, pricing, or what a 3D rebuild of your site would look like.`

const ChatbotWidget: React.FC = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: 'greeting', role: 'assistant', content: SYSTEM_GREETING },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('https://crazyweb-backend.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })),
        }),
      })

      if (!res.ok) throw new Error('API error')

      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + '-ai', role: 'assistant', content: data.message },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + '-err',
          role: 'assistant',
          content:
            'Transmission error. Please try again.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-panel"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`
              fixed bottom-24 right-5 z-50
              w-80 sm:w-96 rounded-2xl overflow-hidden
              shadow-2xl border flex flex-col
              ${isDark
                ? 'bg-[#0a0a0a] border-white/10'
                : 'bg-white border-gray-200'}
            `}
            style={{ maxHeight: '520px', height: '520px' }}
          >
            {/* Header */}
            <div
              className={`
                flex items-center justify-between px-5 py-4 flex-shrink-0
                border-b
                ${isDark ? 'border-white/8 bg-[#0D0D0D]' : 'border-gray-100 bg-gray-50'}
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-cyber-lime`}>
                  <Bot size={16} className="text-black" />
                </div>
                <div>
                  <p className={`font-outfit font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    CrazyWeb AI
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className={`font-inter text-[10px] ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                      Elite Mode Active
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-white/40 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 chat-messages"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`
                      w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5
                      ${msg.role === 'assistant'
                        ? 'bg-cyber-lime text-black'
                        : isDark ? 'bg-white/10 text-white/60' : 'bg-gray-100 text-gray-500'}
                    `}
                  >
                    {msg.role === 'assistant' ? <Bot size={13} /> : <User size={13} />}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`
                      max-w-[78%] px-3.5 py-2.5 rounded-2xl font-inter text-sm leading-relaxed whitespace-pre-wrap
                      ${msg.role === 'assistant'
                        ? isDark
                          ? 'bg-white/5 text-white/80 rounded-tl-sm'
                          : 'bg-gray-100 text-gray-700 rounded-tl-sm'
                        : 'bg-cyber-lime text-black rounded-tr-sm font-medium'}
                    `}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-cyber-lime text-black flex-shrink-0">
                    <Bot size={13} />
                  </div>
                  <div className={`px-4 py-3 rounded-2xl rounded-tl-sm ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                    <div className="flex gap-1.5 items-center">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-cyber-lime"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              className={`
                flex items-center gap-2 px-4 py-3 flex-shrink-0
                border-t
                ${isDark ? 'border-white/8 bg-[#0D0D0D]' : 'border-gray-100'}
              `}
            >
              <input
                id="chatbot-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about our 3D services…"
                className={`
                  flex-1 bg-transparent font-inter text-sm outline-none
                  placeholder:text-white/25
                  ${isDark ? 'text-white placeholder:text-white/25' : 'text-gray-800 placeholder:text-gray-400'}
                `}
              />
              <button
                id="chatbot-send-btn"
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className={`
                  w-8 h-8 rounded-lg flex items-center justify-center transition-all
                  ${input.trim() && !isLoading
                    ? 'bg-cyber-lime text-black hover:scale-110 cursor-pointer'
                    : isDark ? 'bg-white/5 text-white/20' : 'bg-gray-100 text-gray-300'}
                `}
                aria-label="Send message"
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bubble Trigger */}
      <motion.button
        id="chatbot-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-2xl bg-cyber-lime text-black flex items-center justify-center shadow-lg cursor-pointer"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        animate={isOpen ? {} : {
          boxShadow: [
            '0 0 0px rgba(173,255,47,0.4)',
            '0 0 25px rgba(173,255,47,0.6)',
            '0 0 0px rgba(173,255,47,0.4)',
          ],
        }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        aria-label="Open AI chat"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? 'close' : 'open'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </>
  )
}

export default ChatbotWidget
