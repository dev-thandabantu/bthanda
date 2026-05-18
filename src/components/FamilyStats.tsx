'use client'

import { allPeople } from '@/data/family'

export default function FamilyStats() {
  const total = allPeople.length
  const living = allPeople.filter(p => p.status === 'living').length
  const deceased = allPeople.filter(p => p.status === 'deceased').length
  const countries = new Set(allPeople.map(p => p.country).filter(Boolean)).size
  const generations = new Set(allPeople.map(p => p.generation)).size

  const stats = [
    { label: 'documented', value: total },
    { label: 'living', value: living },
    { label: 'deceased', value: deceased },
    { label: 'generations', value: generations },
    { label: 'countries', value: countries },
  ]

  return (
    <div className="flex flex-wrap gap-3">
      {stats.map(s => (
        <span
          key={s.label}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs"
        >
          <span className="text-white/80 font-medium">{s.value}</span>
          <span className="text-white/35">{s.label}</span>
        </span>
      ))}
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs text-white/35">
        living document — data grows
      </span>
    </div>
  )
}
