'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Terminal, Shield, BarChart2, Cpu, FileText, PlusCircle } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Overview', icon: Terminal },
    { href: '/agents', label: 'Marketplace', icon: Cpu },
    { href: '/agents/register', label: 'Register Agent', icon: PlusCircle },
    { href: '/advantage-report', label: 'Advantage Report', icon: FileText, badge: 'TermiX' },
    { href: '/dashboard', label: 'My Jobs', icon: BarChart2 },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-fog-light bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-signal/10 border border-signal/30 group-hover:border-signal transition-colors">
            <Terminal className="h-5 w-5 text-signal" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans text-lg font-bold tracking-tight text-bone">ORDERFLOW</span>
              <span className="rounded bg-signal/20 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-signal uppercase tracking-wider">
                BSC Testnet
              </span>
            </div>
            <p className="text-[11px] font-mono text-bone-muted -mt-0.5">BNB Agent Studio Marketplace</p>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-fog/60 border border-fog-light rounded-lg p-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname ? (pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))) : false;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
                  isActive
                    ? 'bg-signal text-ink font-semibold shadow-sm'
                    : 'text-bone-muted hover:text-bone hover:bg-fog-light/50'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{link.label}</span>
                {link.badge && (
                  <span
                    className={`text-[9px] px-1 rounded uppercase tracking-wider ${
                      isActive ? 'bg-ink/20 text-ink' : 'bg-signal/20 text-signal'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Wallet Connect */}
        <div className="flex items-center gap-3">
          <ConnectButton
            chainStatus="icon"
            showBalance={false}
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full',
            }}
          />
        </div>
      </div>
    </header>
  );
}
