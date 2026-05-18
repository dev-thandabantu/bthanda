'use client'

import { useRef, useState, useEffect } from 'react'

interface Props {
  number: number
  title: string
  status: 'abandoned' | 'current' | 'experimental'
  verdict: string
  what: React.ReactNode
  problem: React.ReactNode
  learned: React.ReactNode
  children: React.ReactNode
}

export default function AttemptSection({
  number, title, status, verdict, what, problem, learned, children,
}: Props) {
  const vizRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const toggleFullscreen = () => {
    const el = vizRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }

  const statusColor =
    status === 'current'   ? 'text-emerald-400/70 border-emerald-400/20 bg-emerald-400/[0.04]' :
    status === 'abandoned' ? 'text-white/25 border-white/10 bg-white/[0.02]' :
                             'text-yellow-400/70 border-yellow-400/20 bg-yellow-400/[0.04]'

  return (
    <div>
      {/* Header row */}
      <div className="flex items-start gap-4 mb-6">
        <span className="text-[10px] text-white/15 font-mono mt-1.5 w-16 shrink-0 tabular-nums">
          {String(number).padStart(2, '0')}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h2 className="text-white/80 font-medium">{title}</h2>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${statusColor}`}>
              {status}
            </span>
          </div>
          <p className="text-white/30 text-sm italic">{verdict}</p>
        </div>
      </div>

      {/* Notes grid */}
      <div className="ml-20 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl">
        <Note label="what it is">{what}</Note>
        <Note label="the problem">{problem}</Note>
        <Note label="what i learned">{learned}</Note>
      </div>

      {/* Visualization wrapper */}
      <div
        ref={vizRef}
        className="ml-20 rounded-2xl border border-white/[0.06] overflow-hidden bg-[#080808] relative"
      >
        <button
          onClick={toggleFullscreen}
          className="absolute top-3 right-3 z-10 text-white/20 hover:text-white/55 transition-colors bg-black/40 rounded-lg p-1.5"
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? (
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M5 1H1v4M9 1h4v4M5 13H1v-4M9 13h4v-4" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" />
            </svg>
          )}
        </button>

        <div className="h-[70vh] min-h-[500px]">
          {children}
        </div>
      </div>
    </div>
  )
}

function Note({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-widest text-white/20 mb-1.5">{label}</p>
      <div className="text-xs text-white/40 leading-relaxed [&_a]:text-white/30 [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-white/60 [&_a]:transition-colors">
        {children}
      </div>
    </div>
  )
}
