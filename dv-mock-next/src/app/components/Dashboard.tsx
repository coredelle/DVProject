'use client'
import React, { useState } from 'react'

function ProgressBar({ stage }: { stage: number }) {
  const stages = ['Submitted', 'In Review', 'Completed']
  return (
    <div className="flex items-center gap-4">
      {stages.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${i <= stage ? 'bg-blue-600' : 'bg-gray-300'}`} />
          <span className={`text-sm ${i <= stage ? 'text-gray-900' : 'text-gray-500'}`}>{s}</span>
          {i < stages.length - 1 && <div className={`mx-2 h-0.5 w-10 ${i < stage ? 'bg-blue-600' : 'bg-gray-300'}`} />}
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [files, setFiles] = useState<{ name: string }[]>([])
  const [stage, setStage] = useState(0)
  const [chat, setChat] = useState<any[]>([
    { role: 'assistant', text: 'Your claim is under review. Emphasize pre-accident condition and comps.' },
  ])
  const [chatInput, setChatInput] = useState('')

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files || []).map(f => ({ name: f.name }))
    setFiles(p => [...p, ...list])
  }
  const send = () => {
    if (!chatInput.trim()) return
    setChat(c => [...c, { role: 'user', text: chatInput.trim() }])
    setChatInput('')
    setTimeout(() => setChat(c => [...c, { role: 'assistant', text: 'Thanks. Reference the appraisal DV amount and DOI directive language.' }]), 600)
  }

  return (
    <main className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
      <section className="md:col-span-2 space-y-6">
        <div className="rounded-2xl border bg-white p-5">
          <div className="mb-3 text-lg font-semibold">Claim Status</div>
          <ProgressBar stage={stage} />
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={() => alert('Demand letter re-sent (mock)')}>Resend Demand Letter</button>
            <button className="btn-secondary" onClick={() => alert('Filed DOI complaint (mock)')}>File DOI Complaint</button>
            <button className="btn-secondary" onClick={() => setStage(s => Math.min(2, s + 1))}>Advance Stage (mock)</button>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <div className="mb-3 text-lg font-semibold">Upload Insurer Communication</div>
          <div className="rounded-xl border border-dashed p-6 text-center">
            <input id="insfile" type="file" multiple onChange={onFile} className="hidden" />
            <label htmlFor="insfile" className="cursor-pointer text-blue-600 underline">Drag & drop or click to upload</label>
          </div>
          {files.length > 0 && (
            <ul className="mt-3 list-disc space-y-1 pl-6 text-sm">
              {files.map(f => <li key={f.name}>{f.name}</li>)}
            </ul>
          )}
          <div className="mt-4 flex gap-2">
            <button className="btn-secondary" onClick={() => alert('Downloaded appraisal (mock)')}>Download Report</button>
          </div>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="rounded-2xl border bg-white p-5">
          <div className="mb-3 text-lg font-semibold">Assistant</div>
          <div className="h-64 overflow-y-auto rounded-md border p-3 text-sm">
            {chat.map((m, i) => (
              <div key={i} className={`mb-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block max-w-[85%] rounded-lg px-3 py-2 ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input className="input flex-1" placeholder="Type a message…" value={chatInput} onChange={e => setChatInput(e.target.value)} />
            <button className="btn-primary" onClick={send}>Send</button>
          </div>
          <div className="mt-3">
            <button className="btn-primary w-full" onClick={() => alert('Connecting to legal help (mock)')}>Contact Legal Help</button>
          </div>
        </div>
      </aside>
    </main>
  )
}
