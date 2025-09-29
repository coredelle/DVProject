'use client'
import React, { useMemo, useState } from 'react'
import Modal from '../Modal'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-medium text-gray-700">{label}</span>
      {children}
    </label>
  )
}
const StepIndicator = ({ step, total = 3 }: { step: number; total?: number }) => (
  <div className="mt-1 text-center text-sm text-gray-500">Step {step} of {total}</div>
)
const PrettyNumber = ({ value }: { value: number }) => {
  const formatted = useMemo(
    () => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0),
    [value]
  )
  return <span className="text-4xl font-bold text-blue-600">{formatted}</span>
}

export default function Wizard({ open, onClose, onFinish }: { open: boolean; onClose: () => void; onFinish: () => void }) {
  const [step, setStep] = useState(1)
  const [processing, setProcessing] = useState(false)
  const [eligibility, setEligibility] = useState({
    vin: '', mileage: '', year: '', make: '', model: '', state: 'GA', accidentDate: '', fault: 'Not at fault'
  })
  const [files, setFiles] = useState<{ name: string; type: string }[]>([])
  const [ocr, setOcr] = useState({ vin: '', repairCost: '', odometer: '', dateOfLoss: '' })
  const [dvAmount, setDvAmount] = useState(0)
  const [preview, setPreview] = useState(false)

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files || []).map(f => ({ name: f.name, type: f.type || 'application/octet-stream' }))
    setFiles(p => [...p, ...list])
  }
  const rm = (n: string) => setFiles(p => p.filter(f => f.name !== n))
  const simulateOCR = () => {
    setProcessing(true)
    setTimeout(() => {
      setOcr({
        vin: eligibility.vin || '7PDSGABA9RN043065',
        repairCost: '$21,573.48',
        odometer: eligibility.mileage || '9,378',
        dateOfLoss: eligibility.accidentDate || '2024-12-07',
      })
      setProcessing(false)
    }, 1000)
  }
  const simulateDV = () => {
    setProcessing(true)
    setTimeout(() => {
      const base = 3500
      const rand = Math.floor(Math.random() * 3500)
      setDvAmount(base + rand)
      setProcessing(false)
    }, 1000)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={step === 1 ? "See If You're Eligible to Recover Lost Value" : step === 2 ? 'Document Upload and Parsing' : 'DV Estimation Results'}
    >
      {step === 1 && (
        <div>
          <p className="text-gray-600">Fill in a few details to check basic eligibility. This is a mock.</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="VIN"><input className="input" value={eligibility.vin} onChange={e => setEligibility({ ...eligibility, vin: e.target.value })} placeholder="17 characters" /></Field>
            <Field label="Mileage"><input className="input" value={eligibility.mileage} onChange={e => setEligibility({ ...eligibility, mileage: e.target.value })} placeholder="9378" /></Field>
            <Field label="Year"><input className="input" value={eligibility.year} onChange={e => setEligibility({ ...eligibility, year: e.target.value })} placeholder="2024" /></Field>
            <Field label="Make"><input className="input" value={eligibility.make} onChange={e => setEligibility({ ...eligibility, make: e.target.value })} placeholder="Rivian" /></Field>
            <Field label="Model"><input className="input" value={eligibility.model} onChange={e => setEligibility({ ...eligibility, model: e.target.value })} placeholder="R1S" /></Field>
            <Field label="State">
              <select className="input" value={eligibility.state} onChange={e => setEligibility({ ...eligibility, state: e.target.value })}>
                {'AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY'
                  .split(' ')
                  .map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Date of Accident"><input type="date" className="input" value={eligibility.accidentDate} onChange={e => setEligibility({ ...eligibility, accidentDate: e.target.value })} /></Field>
            <Field label="Accident Fault Status">
              <select className="input" value={eligibility.fault} onChange={e => setEligibility({ ...eligibility, fault: e.target.value })}>
                <option>Not at fault</option>
                <option>At fault</option>
                <option>Shared fault</option>
              </select>
            </Field>
          </div>
          <StepIndicator step={1} />
          <div className="mt-4 flex justify-end gap-2">
            <button className="btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn-primary" onClick={() => setStep(2)}>Check Eligibility</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="text-gray-600">Upload repair invoices/photos. We’ll <b>simulate</b> OCR and show extracted fields.</p>
          <div className="rounded-xl border border-dashed p-6 text-center">
            <input id="fileinput" type="file" multiple onChange={onFile} className="hidden" />
            <label htmlFor="fileinput" className="cursor-pointer text-blue-600 underline">Drag & drop or click to upload</label>
            <div className="mt-2 text-xs text-gray-500">PDF, JPG, PNG</div>
          </div>
          {files.length > 0 && (
            <div className="space-y-2 rounded-xl border p-3">
              <div className="text-sm font-medium">Files</div>
              {files.map(f => (
                <div key={f.name} className="flex items-center justify-between rounded-md bg-gray-50 p-2">
                  <div className="truncate text-sm">{f.name}</div>
                  <button className="text-sm text-red-600 hover:underline" onClick={() => rm(f.name)}>Remove</button>
                </div>
              ))}
              <div className="pt-2">
                <button className="btn-primary" disabled={processing} onClick={simulateOCR}>
                  {processing ? 'Running OCR…' : 'Extract with OCR'}
                </button>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="VIN"><input className="input" value={ocr.vin} onChange={e => setOcr({ ...ocr, vin: e.target.value })} placeholder="autofilled by OCR" /></Field>
            <Field label="Repair Cost"><input className="input" value={ocr.repairCost} onChange={e => setOcr({ ...ocr, repairCost: e.target.value })} placeholder="$0.00" /></Field>
            <Field label="Odometer"><input className="input" value={ocr.odometer} onChange={e => setOcr({ ...ocr, odometer: e.target.value })} placeholder="12,345" /></Field>
            <Field label="Date of Loss"><input className="input" value={ocr.dateOfLoss} onChange={e => setOcr({ ...ocr, dateOfLoss: e.target.value })} placeholder="YYYY-MM-DD" /></Field>
          </div>
          <StepIndicator step={2} />
          <div className="mt-4 flex justify-between">
            <button className="btn-secondary" onClick={() => setStep(1)}>Back</button>
            <button className="btn-primary" disabled={processing} onClick={() => { simulateDV(); setStep(3); }}>
              {processing ? 'Calculating…' : 'Continue'}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <p className="text-gray-600">Here is a simulated diminished value based on mock comps.</p>
          <div className="rounded-xl border p-6 text-center"><PrettyNumber value={dvAmount} /></div>
          <div className="rounded-xl border p-4 mt-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-8 rounded bg-gray-200" />
              <div>
                <div className="font-medium">Certified Appraisal (Preview)</div>
                <button className="text-blue-600 underline" onClick={() => setPreview(true)}>Open preview</button>
              </div>
            </div>
          </div>
          <StepIndicator step={3} />
          <div className="mt-4 flex justify-between">
            <button className="btn-secondary" onClick={() => setStep(2)}>Back</button>
            <div className="flex gap-2">
              <button className="btn-secondary" onClick={onClose}>Close</button>
              <button className="btn-primary" onClick={() => { onClose(); onFinish(); }}>Go to Dashboard</button>
            </div>
          </div>

          {preview && (
            <Modal open={preview} onClose={() => setPreview(false)} title="Certified Appraisal – Preview">
              <div className="space-y-2 text-sm text-gray-700">
                <p><b>Owner:</b> Jane Doe</p>
                <p><b>VIN:</b> {ocr.vin || eligibility.vin || '7PDSGABA9RN043065'}</p>
                <p><b>Repair Cost:</b> {ocr.repairCost || '$21,573.48'}</p>
                <p><b>Estimated DV:</b> <PrettyNumber value={dvAmount} /></p>
                <div className="rounded-lg bg-gray-50 p-3">PDF content would render here in the real app.</div>
              </div>
            </Modal>
          )}
        </div>
      )}
    </Modal>
  )
}