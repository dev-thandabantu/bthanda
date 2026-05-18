'use client'

import dynamic from 'next/dynamic'

const FamilyChart = dynamic(() => import('./index'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-white/30 text-sm">
      Loading family chart…
    </div>
  ),
})

export default function FamilyChartLoader() {
  return <FamilyChart />
}
