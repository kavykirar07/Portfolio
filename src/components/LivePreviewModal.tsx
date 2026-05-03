import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Monitor, Smartphone, ExternalLink, RefreshCw, Loader2 } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

interface LivePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  projectTitle: string
  liveUrl: string
  accentColor: string
}

type ViewMode = 'desktop' | 'mobile'

const IFRAME_WIDTHS: Record<ViewMode, string> = {
  desktop: '100%',
  mobile: '390px',
}

const LivePreviewModal: React.FC<LivePreviewModalProps> = ({
  isOpen,
  onClose,
  projectTitle,
  liveUrl,
  accentColor,
}) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [viewMode, setViewMode] = useState<ViewMode>('desktop')
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setIsLoading(true)
      setHasError(false)
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen, liveUrl])

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false)
  }, [])

  const handleIframeError = useCallback(() => {
    setIsLoading(false)
    setHasError(true)
  }, [])

  const handleRefresh = useCallback(() => {
    setIsLoading(true)
    setHasError(false)
    setRefreshKey(k => k + 1)
  }, [])

  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }, [onClose])

  // Keyboard escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="live-preview-overlay"
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          role="dialog"
          aria-modal="true"
          aria-label={`Live preview of ${projectTitle}`}
        >
          <motion.div
            className={`live-preview-panel ${isDark ? 'preview-dark' : 'preview-light'}`}
            initial={{ scale: 0.88, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 40 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* ─── Toolbar ─────────────────────────────────────────────── */}
            <div className="preview-toolbar">
              {/* Left: Title */}
              <div className="preview-title-group">
                {/* Traffic-light dots */}
                <span className="browser-dot bg-[#ff5f57]" />
                <span className="browser-dot bg-[#febc2e]" />
                <span className="browser-dot bg-[#28c840]" />
                <span
                  className="preview-project-name"
                  style={{ color: accentColor }}
                >
                  {projectTitle}
                </span>
              </div>

              {/* Center: Address bar */}
              <div className={`preview-address-bar ${isDark ? 'address-dark' : 'address-light'}`}>
                <span className="preview-url-text">{liveUrl}</span>
              </div>

              {/* Right: Controls */}
              <div className="preview-controls">
                {/* Desktop toggle */}
                <button
                  id="preview-toggle-desktop"
                  className={`preview-toggle-btn ${viewMode === 'desktop' ? 'toggle-active' : ''}`}
                  onClick={() => setViewMode('desktop')}
                  title="Desktop view"
                  aria-label="Switch to desktop view"
                  style={viewMode === 'desktop' ? { color: accentColor, borderColor: accentColor } : {}}
                >
                  <Monitor size={15} />
                </button>
                {/* Mobile toggle */}
                <button
                  id="preview-toggle-mobile"
                  className={`preview-toggle-btn ${viewMode === 'mobile' ? 'toggle-active' : ''}`}
                  onClick={() => setViewMode('mobile')}
                  title="Mobile view"
                  aria-label="Switch to mobile view"
                  style={viewMode === 'mobile' ? { color: accentColor, borderColor: accentColor } : {}}
                >
                  <Smartphone size={15} />
                </button>
                {/* Refresh */}
                <button
                  id="preview-refresh"
                  className="preview-icon-btn"
                  onClick={handleRefresh}
                  title="Refresh preview"
                  aria-label="Refresh iframe"
                >
                  <RefreshCw size={14} />
                </button>
                {/* Open in new tab */}
                <a
                  id="preview-open-external"
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="preview-icon-btn"
                  title="Open in new tab"
                  aria-label="Open live site in new tab"
                >
                  <ExternalLink size={14} />
                </a>
                {/* Close */}
                <button
                  id="preview-close"
                  className="preview-close-btn"
                  onClick={onClose}
                  aria-label="Close preview"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* ─── Viewport ────────────────────────────────────────────── */}
            <div className="preview-viewport-wrapper">
              {/* Mobile device frame */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={viewMode}
                  className="preview-viewport"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.22 }}
                  style={{ width: IFRAME_WIDTHS[viewMode] }}
                >
                  {/* Loading skeleton */}
                  {isLoading && !hasError && (
                    <div className="iframe-skeleton">
                      <div className="skeleton-spinner">
                        <Loader2 size={32} className="spin-icon" style={{ color: accentColor }} />
                      </div>
                      <div className="skeleton-lines">
                        <div className="skeleton-line w-3/4" />
                        <div className="skeleton-line w-1/2" />
                        <div className="skeleton-line w-full" />
                        <div className="skeleton-line w-5/6" />
                        <div className="skeleton-line w-2/3" />
                      </div>
                    </div>
                  )}

                  {/* Error state */}
                  {hasError && (
                    <div className="iframe-error">
                      <span className="error-icon">⚠️</span>
                      <p className="error-title">Preview Blocked</p>
                      <p className="error-sub">
                        This site restricts embedding. Open it directly instead.
                      </p>
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="error-link"
                        style={{ color: accentColor }}
                      >
                        Open Live Site <ExternalLink size={12} className="inline ml-1" />
                      </a>
                    </div>
                  )}

                  {/* Iframe */}
                  {!hasError && (
                    <iframe
                      key={`${liveUrl}-${refreshKey}`}
                      ref={iframeRef}
                      src={liveUrl}
                      title={`Live preview of ${projectTitle}`}
                      className={`preview-iframe ${isLoading ? 'iframe-hidden' : 'iframe-visible'}`}
                      onLoad={handleIframeLoad}
                      onError={handleIframeError}
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ─── Footer bar ──────────────────────────────────────────── */}
            <div className="preview-footer">
              <div className="preview-status-dot" style={{ background: isLoading ? '#febc2e' : hasError ? '#ff5f57' : '#28c840' }} />
              <span className="preview-status-text">
                {isLoading ? 'Loading…' : hasError ? 'Blocked by X-Frame-Options' : 'Live'}
              </span>
              <span className="preview-footer-spacer" />
              <span className="preview-mode-label">
                {viewMode === 'desktop' ? '↔ Desktop' : '📱 Mobile (390px)'}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LivePreviewModal
