'use client'
import React, { useState } from 'react'
import Wizard from './components/Wizard'
import Dashboard from './components/Dashboard'

export default function Page() {
  const [open, setOpen] = useState(false)
  return (
    <div className="p-6">
      <header className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="text-xl font-bold">DV Claim Platform</div>
        <div className="flex gap-2">
          <button
            className="btn-secondary"
            onClick={() => {
              setOpen(true)
            }}
          >
            Start Wizard
          </button>
        </div>
      </header>
      <Dashboard />
      <Wizard open={open} onClose={() => setOpen(false)} onFinish={() => setOpen(false)} />
    </div>
  )
}
