import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HuurEenMens.ai - Huur mensen voor AI agenten',
  description: 'AI agenten kunnen mensen huren voor echte fysieke taken. MCP server integratie, REST API, flexibele betalingen.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  )
}
