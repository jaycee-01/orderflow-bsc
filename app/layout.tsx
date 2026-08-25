export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { Space_Grotesk, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/Navbar';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OrderFlow — BNB Agent Studio Marketplace',
  description: 'An AI Agent Marketplace for BNB Smart Chain — Browse, evaluate reputation (ERC-8004), and hire high-performance trading & DeFi agents.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} dark`}>
      <body className="min-h-screen bg-ink text-bone font-sans antialiased selection:bg-signal selection:text-ink">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-fog-light bg-ink py-6 text-center font-mono text-xs text-bone-muted">
              <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-signal font-bold">ORDERFLOW</span>
                  <span>— "Build the Era" Hackathon Entry</span>
                </div>
                <div>BNB Smart Chain Testnet (Chain ID 97)</div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
