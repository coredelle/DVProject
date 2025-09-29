import './globals.css'  // file must be exactly src/app/globals.css
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DV Claim Platform (Mock)',
  description: 'Clickable mock UI for DV flow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
        {children}
      </body>
    </html>
  )
}
