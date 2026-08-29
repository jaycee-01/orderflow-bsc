'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, DollarSign, Send, ShieldCheck, ArrowRight } from 'lucide-react';

interface StepDetail {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  badge: string;
  icon: typeof CheckCircle2;
  techNote: string;
  svgShape: React.ReactNode;
}

const STEPS: StepDetail[] = [
  {
    id: 'open',
    number: '01',
    title: 'OPEN',
    shortDesc: 'Job Broadcast & Requirements',
    fullDesc: 'Client defines task scope, performance parameters, and target budget in $U stablecoin.',
    badge: 'State 0: Pending Escrow',
    icon: CheckCircle2,
    techNote: 'ERC-8183 createJob() registers contract state on BSC Testnet with evaluator specifications.',
    // Faint document / spec sheet outline
    svgShape: (
      <svg className="w-48 h-48 text-signal/40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
        <rect x="25" y="15" width="50" height="70" rx="4" strokeDasharray="3 3" />
        <line x1="35" y1="30" x2="65" y2="30" />
        <line x1="35" y1="42" x2="60" y2="42" />
        <line x1="35" y1="54" x2="55" y2="54" />
        <circle cx="60" cy="68" r="8" strokeDasharray="2 2" />
      </svg>
    )
  },
  {
    id: 'funded',
    number: '02',
    title: 'FUNDED',
    shortDesc: 'Non-Custodial Escrow Lock',
    fullDesc: 'Client deposits job payment into non-custodial ERC-8183 escrow via Altana $U / x402 payment rail. Funds remain securely locked — nothing reaches the agent yet.',
    badge: 'State 1: Escrow Locked',
    icon: DollarSign,
    techNote: 'x402 EIP-3009 off-chain permit signature locks $U tokens directly inside ERC-8183 escrow.',
    // Faint escrow box + lock outline
    svgShape: (
      <svg className="w-48 h-48 text-signal/40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
        <rect x="20" y="35" width="60" height="45" rx="4" strokeDasharray="3 3" />
        <path d="M35 35 V 25 A 15 15 0 0 1 65 25 V 35" strokeDasharray="2 2" />
        <circle cx="50" cy="55" r="5" />
      </svg>
    )
  },
  {
    id: 'submitted',
    number: '03',
    title: 'SUBMITTED',
    shortDesc: 'Autonomous Task Execution',
    fullDesc: 'The hired AI Agent picks up the funded job payload, executes strategy on-chain or off-chain, and submits verifiable output back to the contract.',
    badge: 'State 2: Awaiting Attestation',
    icon: Send,
    techNote: 'Agent calls submitJob() providing cryptographic proof/hash of completed deliverable.',
    // Faint execution nodes / payload outline
    svgShape: (
      <svg className="w-48 h-48 text-signal/40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="30" cy="50" r="12" strokeDasharray="3 3" />
        <circle cx="70" cy="30" r="10" strokeDasharray="3 3" />
        <circle cx="70" cy="70" r="10" strokeDasharray="3 3" />
        <line x1="42" y1="45" x2="60" y2="35" strokeDasharray="2 2" />
        <line x1="42" y1="55" x2="60" y2="65" strokeDasharray="2 2" />
      </svg>
    )
  },
  {
    id: 'completed',
    number: '04',
    title: 'COMPLETED',
    shortDesc: 'Attestation & Settlement',
    fullDesc: 'Evaluator node verifies output validity. Upon successful attestation, $U escrow releases automatically to agent wallet, updating ERC-8004 reputation score.',
    badge: 'State 3: Settlement Done',
    icon: ShieldCheck,
    techNote: 'completeJob() releases escrowed $U to agent and increments on-chain ERC-8004 reputation.',
    // Faint checkmark shield outline
    svgShape: (
      <svg className="w-48 h-48 text-signal/40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M50 15 L80 25 V50 C80 70 50 85 50 85 C50 85 20 70 20 50 V25 Z" strokeDasharray="3 3" />
        <path d="M38 48 L46 56 L62 40" strokeWidth="1.5" />
      </svg>
    )
  }
];

export function HiringFlowTimeline() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-cycle through steps every 3.5s when section is in view (unless prefers-reduced-motion is true)
  useEffect(() => {
    if (!isInView || reducedMotion) return;

    const timer = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % STEPS.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [isInView, reducedMotion]);

  const currentStep = STEPS[activeStepIndex];
  const IconComponent = currentStep.icon;

  // Calculate percentage width for connecting progress bar
  const progressPercent = (activeStepIndex / (STEPS.length - 1)) * 100;

  return (
    <div
      ref={sectionRef}
      className={`rounded-xl border border-fog-light bg-fog p-6 sm:p-8 space-y-8 transition-all duration-700 ease-out ${
        isInView || reducedMotion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-fog-light/60 pb-5">
        <div>
          <div className="text-xs font-mono text-signal-text uppercase tracking-wider font-semibold flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-signal" />
            ERC-8183 Native Lifecycle
          </div>
          <h2 className="text-2xl font-bold text-bone tracking-tight mt-1">How Hiring Works</h2>
        </div>
        <p className="text-xs font-mono text-bone-muted max-w-sm">
          Non-custodial 4-stage job escrow flow powered by Altana $U settlement.
        </p>
      </div>

      {/* Horizontal Step Timeline */}
      <div className="relative py-4 px-2">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-fog-light/80 z-0" />

        {/* Active Signal Amber Progress Line */}
        <div
          className="absolute top-1/2 left-6 -translate-y-1/2 h-0.5 bg-signal transition-all duration-500 ease-in-out z-0 shadow-[0_0_8px_rgba(245,166,35,0.4)]"
          style={{ width: `calc(${progressPercent}% * 0.88)` }}
        />

        {/* Step Dots */}
        <div className="relative z-10 flex justify-between items-center">
          {STEPS.map((step, idx) => {
            const isActive = idx === activeStepIndex;
            const isCompleted = idx < activeStepIndex;

            return (
              <button
                key={step.id}
                onClick={() => setActiveStepIndex(idx)}
                className="group flex flex-col items-center focus:outline-none"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-mono text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-signal text-slate-950 scale-110 shadow-[0_0_16px_rgba(245,166,35,0.4)] border-2 border-signal-hover'
                      : isCompleted
                      ? 'bg-signal/20 text-signal-text border border-signal/40'
                      : 'bg-fog border border-fog-light text-bone-muted group-hover:border-signal/40 group-hover:text-bone'
                  }`}
                >
                  {step.number}
                </div>
                <span
                  className={`mt-2 font-mono text-[11px] font-bold tracking-wider uppercase transition-colors ${
                    isActive ? 'text-signal-text' : 'text-bone-muted group-hover:text-bone'
                  }`}
                >
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Detail Panel with Soft Ambient Glow & Subtle Technical Outline */}
      <div className="relative overflow-hidden rounded-lg border border-fog-light/80 bg-fog-light/30 p-6 transition-all duration-300">
        
        {/* Soft Radial Ambient Glow */}
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-signal/10 blur-3xl animate-ambient-glow" />

        {/* Contextual Technical SVG Outline Shape (Faint Texture) */}
        <div className="pointer-events-none absolute top-1/2 right-8 -translate-y-1/2 opacity-25 transition-opacity duration-500">
          {currentStep.svgShape}
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-signal/15 border border-signal/30 text-signal-text">
                {currentStep.badge}
              </span>
              <span className="text-xs font-mono text-bone-muted">Step {currentStep.number} of 04</span>
            </div>

            <h3 className="text-lg font-bold text-bone flex items-center gap-2">
              <IconComponent className="h-5 w-5 text-signal-text" />
              {currentStep.shortDesc}
            </h3>

            <p className="text-sm text-bone leading-relaxed opacity-90">
              {currentStep.fullDesc}
            </p>

            <div className="pt-2 font-mono text-xs text-bone-muted/90 flex items-center gap-2 border-t border-fog-light/40">
              <ArrowRight className="h-3.5 w-3.5 text-signal-text shrink-0" />
              <span>{currentStep.techNote}</span>
            </div>
          </div>

          {/* Code/Status Visual Snippet */}
          <div className="w-full md:w-72 shrink-0 rounded bg-slate-950/80 border border-fog-light/80 p-4 font-mono text-xs space-y-2">
            <div className="text-[10px] text-bone-muted uppercase tracking-wider border-b border-fog-light/40 pb-1.5 flex justify-between items-center">
              <span>ESCROW STATE</span>
              <span className="text-signal-text font-bold">STATE #{activeStepIndex}</span>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between text-bone-muted">
                <span>Protocol:</span>
                <span className="text-bone">ERC-8183</span>
              </div>
              <div className="flex justify-between text-bone-muted">
                <span>Rail:</span>
                <span className="text-bone">Altana $U x402</span>
              </div>
              <div className="flex justify-between text-bone-muted">
                <span>Status:</span>
                <span className="text-signal-text font-bold uppercase">{currentStep.title}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
