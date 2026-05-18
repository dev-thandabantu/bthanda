'use client'

import dynamic from 'next/dynamic'

const FamilyFlow = dynamic(() => import('./index'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-white/20 text-sm">
      Loading…
    </div>
  ),
})

export default function Attempt4Loader() {
  return <FamilyFlow />
}
