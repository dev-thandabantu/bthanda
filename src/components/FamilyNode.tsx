'use client'

import type { FamilyPerson } from '@/data/family-types'

const COUNTRY_LABELS: Record<string, string> = {
  ZW: 'ZW',
  ZA: 'ZA',
  MZ: 'MZ',
  other: '??',
}

interface Props {
  person: FamilyPerson
  isEgo?: boolean
  isHighlighted?: boolean
}

export default function FamilyNode({ person, isEgo, isHighlighted }: Props) {
  const isDead = person.status === 'deceased'

  return (
    <div
      className={[
        'group relative flex flex-col items-center justify-center rounded-lg border transition-all duration-150 cursor-pointer select-none',
        isEgo
          ? 'w-20 h-14 border-white bg-white text-black font-semibold text-[11px]'
          : isDead
            ? 'w-16 h-10 border-white/20 bg-transparent text-white/30 text-[9px]'
            : 'w-16 h-10 border-white/20 bg-white/5 text-white/70 text-[9px]',
        isHighlighted && !isEgo ? 'border-white/60 bg-white/10 text-white/90' : '',
      ].join(' ')}
    >
      {/* Deceased indicator — hollow ring overlay */}
      {isDead && (
        <span className="absolute inset-0 rounded-lg border border-white/10 pointer-events-none" />
      )}

      <span className="leading-tight text-center px-1 truncate max-w-full">
        {person.displayName}
      </span>

      {person.country && !isEgo && (
        <span className="text-[8px] text-white/25 mt-0.5">
          {COUNTRY_LABELS[person.country] ?? ''}
        </span>
      )}
    </div>
  )
}

// Hover card shown on the page level — exported for use in FamilyTree
export function FamilyHoverCard({ person }: { person: FamilyPerson }) {
  return (
    <div className="rounded-lg border border-white/15 bg-[#111] p-4 shadow-xl w-64 text-sm pointer-events-none">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="text-white/90 font-medium leading-tight">{person.name}</p>
          <p className="text-white/40 text-xs mt-0.5">{person.relationship}</p>
        </div>
        <span
          className={[
            'shrink-0 text-[10px] rounded-full px-2 py-0.5 border mt-0.5',
            person.status === 'living'
              ? 'border-white/20 text-white/50'
              : person.status === 'deceased'
                ? 'border-white/10 text-white/25 line-through'
                : 'border-white/10 text-white/25',
          ].join(' ')}
        >
          {person.status}
        </span>
      </div>

      {person.location && (
        <p className="text-white/40 text-xs mb-1">{person.location}</p>
      )}

      {person.country && (
        <p className="text-white/30 text-xs mb-1">
          {COUNTRY_LABELS[person.country] ?? person.country}
        </p>
      )}

      {person.notes && (
        <p className="text-white/35 text-xs mt-2 border-t border-white/8 pt-2 leading-relaxed">
          {person.notes}
        </p>
      )}
    </div>
  )
}
