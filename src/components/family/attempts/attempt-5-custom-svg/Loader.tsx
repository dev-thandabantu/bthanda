'use client'

import dynamic from 'next/dynamic'

const Attempt5 = dynamic(() => import('./index'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center text-white/30 text-sm">
      Loading…
    </div>
  ),
})

export default function Loader() {
  return <Attempt5 />
}
