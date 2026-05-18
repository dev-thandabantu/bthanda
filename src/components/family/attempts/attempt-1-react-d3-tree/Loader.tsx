'use client'

import dynamic from 'next/dynamic'

const Attempt1 = dynamic(() => import('./index'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-white/20 text-xs">Loading…</div>,
})

export default function Attempt1Loader() {
  return <Attempt1 />
}
