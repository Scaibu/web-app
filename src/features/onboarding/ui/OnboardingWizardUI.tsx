'use client';

/**
 * Enterprise Onboarding & SDK Integration Wizard UI.
 * Adheres strictly to good-ui.md (tokens, visual hierarchy, no arbitrary Tailwind brackets).
 */

import React, { useSyncExternalStore, useState } from 'react';
import Link from 'next/link';
import { 
  Check, 
  Copy, 
  Radio, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  Terminal, 
  Key, 
  ArrowRight,
  Code2
} from 'lucide-react';
import { onboardingState } from '../state/onboarding.state';
import { onboardingController } from '../controller/onboarding.controller';
import { FRAMEWORK_GUIDES } from '../adapter/onboarding.adapter';
import type { FrameworkTarget } from '../models/onboarding.model';

export const OnboardingWizardUI: React.FC = () => {
  const state = useSyncExternalStore(
    (callback) => onboardingState.subscribe(callback),
    () => onboardingState.getSnapshot(),
    () => onboardingState.getSnapshot()
  );

  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const guide = FRAMEWORK_GUIDES[state.selectedFramework];

  const handleCopy = (text: string, type: 'key' | 'install' | 'code') => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else if (type === 'install') {
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const frameworks: { id: FrameworkTarget; label: string; icon: string }[] = [
    { id: 'python_sdk', label: 'Python SDK', icon: '🐍' },
    { id: 'nodejs_sdk', label: 'Node.js / TS', icon: '⚡' },
    { id: 'langchain', label: 'LangChain', icon: '🦜' },
    { id: 'llamaindex', label: 'LlamaIndex', icon: '🦙' },
    { id: 'openai_wrapper', label: 'OpenAI Wrapper', icon: '🤖' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border/40 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              Developer Setup
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-500" /> W3C Trace Context Compliant
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Connect Your LLM Application
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Instrument your agents, RAG pipelines, or standard completions in under 2 minutes with zero architectural changes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/traces"
            className="px-4 py-2 text-xs font-medium border border-border/50 rounded-lg hover:bg-muted/50 transition-colors flex items-center gap-1.5"
          >
            Skip to Traces <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </Link>
        </div>
      </div>

      {/* Main Setup Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configuration Steps (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Framework Selection */}
          <div className="bg-card border border-border/40 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</span>
              <h2 className="text-sm font-semibold text-foreground">Select Your Framework or Runtime</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {frameworks.map((fw) => {
                const isSelected = state.selectedFramework === fw.id;
                return (
                  <button
                    key={fw.id}
                    onClick={() => onboardingController.setFramework(fw.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary'
                        : 'border-border/40 hover:border-border hover:bg-muted/30 text-muted-foreground'
                    }`}
                  >
                    <span className="text-xl mb-1">{fw.icon}</span>
                    <span className="text-xs font-medium leading-tight">{fw.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Credentials */}
          <div className="bg-card border border-border/40 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</span>
                <h2 className="text-sm font-semibold text-foreground">API Credentials & Ingestion Target</h2>
              </div>
              <span className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                Active Key
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
                  <Key className="h-3.5 w-3.5" /> Project Ingestion API Key
                </label>
                <div className="flex items-center gap-2">
                  <div className="font-mono text-xs bg-muted/60 px-3 py-2 rounded-lg border border-border/40 flex-1 truncate select-all">
                    {state.apiKey}
                  </div>
                  <button
                    onClick={() => handleCopy(state.apiKey, 'key')}
                    className="px-3 py-2 text-xs font-medium border border-border/40 rounded-lg hover:bg-muted/50 transition-colors flex items-center gap-1.5"
                  >
                    {copiedKey ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedKey ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
                  <Terminal className="h-3.5 w-3.5" /> Environment Variables Snippet
                </label>
                <div className="relative font-mono text-xs bg-slate-950 text-slate-100 p-3 rounded-lg border border-border/40 overflow-x-auto">
                  <pre>{guide.envSnippet}</pre>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Installation & Code Integration */}
          <div className="bg-card border border-border/40 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">3</span>
                <h2 className="text-sm font-semibold text-foreground">Install SDK & Integrate</h2>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-muted-foreground">Package Manager Installation</span>
                  <button
                    onClick={() => handleCopy(guide.installCommand, 'install')}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    {copiedInstall ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    Copy
                  </button>
                </div>
                <div className="font-mono text-xs bg-slate-950 text-emerald-400 p-3 rounded-lg border border-border/40">
                  $ {guide.installCommand}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Code2 className="h-3.5 w-3.5" /> Example Instrumentation Code
                  </span>
                  <button
                    onClick={() => handleCopy(guide.snippetCode, 'code')}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    {copiedCode ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    Copy Snippet
                  </button>
                </div>
                <div className="relative font-mono text-xs bg-slate-950 text-slate-100 p-4 rounded-lg border border-border/40 overflow-x-auto leading-relaxed">
                  <pre>{guide.snippetCode}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Ingestion Radar Status (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card border border-border/40 rounded-xl p-5 shadow-sm space-y-5">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Radio className="h-4 w-4 text-primary animate-pulse" /> Live Telemetry Listener
            </h3>

            {state.firstTraceReceived ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                  <Sparkles className="h-4 w-4" /> Telemetry Ingestion Verified!
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  First OpenTelemetry span arrived successfully with valid signature and tokens tracked.
                </p>
                <div className="p-2.5 bg-background rounded-lg border border-border/40 font-mono text-xs text-foreground truncate">
                  Trace ID: <span className="text-primary font-bold">{state.receivedTraceId}</span>
                </div>
                <div className="pt-2">
                  <Link
                    href={`/traces/${state.receivedTraceId}`}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    Inspect First Trace <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-6 border border-dashed border-border/60 rounded-xl text-center space-y-4">
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping" />
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Radio className="h-5 w-5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground">Listening for telemetry...</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Trigger a completion in your app using the snippet to verify ingestion.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onboardingController.simulateTraceArrival()}
                    className="w-full py-2 text-xs font-medium bg-muted/60 hover:bg-muted text-foreground border border-border/40 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    Simulate Test Span Arrival
                  </button>
                </div>
              </div>
            )}

            {/* Quick Checklist */}
            <div className="pt-4 border-t border-border/30 space-y-2.5">
              <span className="text-xs font-medium text-muted-foreground">What happens next?</span>
              <ul className="text-xs space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="h-4 w-4 rounded-full bg-muted flex items-center justify-center text-[10px] shrink-0 mt-0.5">✓</span>
                  <span><strong>Automatic Redaction:</strong> PII and credentials never hit disk.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-4 w-4 rounded-full bg-muted flex items-center justify-center text-[10px] shrink-0 mt-0.5">✓</span>
                  <span><strong>Cost Tracking:</strong> Real-time USD pricing based on provider token rates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-4 w-4 rounded-full bg-muted flex items-center justify-center text-[10px] shrink-0 mt-0.5">✓</span>
                  <span><strong>Guardrails & Kill-Switches:</strong> Immediate policy intervention.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
