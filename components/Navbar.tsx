'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Terminal, Cpu, FileText, BarChart2, PlusCircle } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Overview', icon: Terminal },
    { href: '/agents', label: 'Marketplace', icon: Cpu },
    { href: '/agents/register', label: 'Register Agent', icon: PlusCircle },
    { href: '/advantage-report', label: 'Advantage Report', icon: FileText, badge: 'TermiX' },
    { href: '/dashboard', label: 'My Jobs', icon: BarChart2 },
  ];

  return (
    <header className="sticky top-3 z-50 px-4 sm:px-6 transition-all duration-300">
      <div
        className={`mx-auto flex items-center justify-between px-4 py-3 rounded-2xl border transition-all duration-300 ${
          scrolled
            ? 'max-w-6xl bg-fog/95 border-fog-light/90 shadow-xl backdrop-blur-md'
            : 'max-w-7xl bg-fog/60 border-fog-light/60 backdrop-blur-sm shadow-md'
        }`}
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-signal/15 border border-signal/30 group-hover:border-signal transition-colors">
            <Terminal className="h-5 w-5 text-signal-text" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans text-lg font-bold tracking-tight text-bone">ORDERFLOW</span>
              <span className="rounded bg-signal/20 px-1.5 py-0.5 text-[10px] font-mono font-bold text-signal-text uppercase tracking-wider">
                BSC Testnet
              </span>
            </div>
            <p className="text-[11px] font-mono text-bone-muted -mt-0.5">BNB Agent Studio Marketplace</p>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-fog-light/40 border border-fog-light rounded-xl p-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname
              ? pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
              : false;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  isActive
                    ? 'bg-signal text-slate-900 font-bold shadow-sm'
                    : 'text-bone-muted hover:text-bone hover:bg-fog-light/50'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{link.label}</span>
                {link.badge && (
                  <span
                    className={`text-[9px] px-1 rounded uppercase tracking-wider font-bold ${
                      isActive ? 'bg-slate-900/20 text-slate-900' : 'bg-signal/20 text-signal-text'
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
