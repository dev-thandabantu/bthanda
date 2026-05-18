'use client'

import { useRef, useEffect, useState } from 'react'
import Tree from 'react-d3-tree'
import type { RawNodeDatum } from 'react-d3-tree'
import { familyTree } from '@/data/family'
import type { FamilyPerson } from '@/data/family-types'

function toD3Node(person: FamilyPerson): RawNodeDatum {
  return {
    name: person.displayName,
    attributes: {
      side: person.side,
      status: person.status,
      country: person.country ?? '',
    },
    children: person.children?.map(toD3Node) ?? [],
  }
}

export default function Attempt1() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 })

  useEffect(() => {
    if (!containerRef.current) return
    const { width, height } = containerRef.current.getBoundingClientRect()
    if (width > 0) setDimensions({ width, height })
  }, [])

  const treeData = toD3Node({ ...familyTree })

  return (
    <div ref={containerRef} className="w-full h-full bg-white">
      <Tree
        data={treeData}
        orientation="vertical"
        translate={{ x: dimensions.width / 2, y: 60 }}
        dimensions={dimensions}
        nodeSize={{ x: 140, y: 80 }}
        separation={{ siblings: 0.5, nonSiblings: 0.6 }}
        initialDepth={2}
        renderCustomNodeElement={({ nodeDatum }) => {
          const d = nodeDatum as { name: string; attributes?: Record<string, string> }
          const side = d.attributes?.side ?? 'both'
          const status = d.attributes?.status ?? 'living'
          const isEgo = d.name === 'Brighton'
          const isDead = status === 'deceased'
          const color = isEgo ? '#ffffff'
            : side === 'maternal' ? '#eab308'
            : side === 'paternal' ? '#818cf8'
            : '#64748b'
          return (
            <g>
              <rect
                x={-55} y={-18} width={110} height={36} rx={10}
                fill={isEgo ? '#ffffff' : 'transparent'}
                stroke={color}
                strokeWidth={isEgo ? 0 : 1}
                strokeOpacity={isDead ? 0.3 : 0.6}
                strokeDasharray={isDead ? '3,2' : undefined}
                opacity={isDead ? 0.4 : 1}
              />
              <text
                textAnchor="middle" y={5}
                fontSize={isEgo ? 11 : 9}
                fontWeight={isEgo ? 700 : 400}
                fill={isEgo ? '#000' : color}
                opacity={isDead ? 0.5 : 0.85}
                fontFamily="var(--font-geist-sans, sans-serif)"
              >
                {d.name}
              </text>
            </g>
          )
        }}
        pathFunc="step"
        zoom={0.6}
        scaleExtent={{ min: 0.1, max: 2 }}
        enableLegacyTransitions={false}
      />
    </div>
  )
}
