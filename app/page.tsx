'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Sparkles, Workflow, Zap } from 'lucide-react';

function LandingPage() {
  const { isSignedIn } = useUser();

  return (
    <div className='min-h-screen relative overflow-hidden bg-[#FAF7F2] flex flex-col text-stone-900'>
      {/* Decorative Background Blobs */}
      <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-amber-400/10 blur-[100px] pointer-events-none z-0'></div>
      <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-400/10 blur-[100px] pointer-events-none z-0'></div>
      <div className='absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-yellow-400/10 blur-[100px] pointer-events-none z-0'></div>
      
      {/* Top Navbar */}
      <header className='w-full px-8 py-5 flex items-center justify-between border-b border-amber-200/50 bg-[#FAF7F2]/80 backdrop-blur-md sticky top-0 z-50 shadow-sm'>
        <div className='flex items-center gap-2'>
          <Image src='/logo.svg' alt='Agentify Logo' width={32} height={32} />
          <span className='font-bold text-xl tracking-tight'>Agentify</span>
        </div>

        <div className='flex items-center gap-3'>
          <Link href={isSignedIn ? '/dashboard' : '/sign-in'}>
            <Button variant='ghost' className='cursor-pointer text-sm text-stone-600 hover:text-stone-900 hover:bg-amber-100/50'>
              {isSignedIn ? 'Dashboard' : 'Sign In'}
            </Button>
          </Link>
          <Link href={isSignedIn ? '/dashboard' : '/sign-up'}>
            <Button className='cursor-pointer text-sm gap-2 bg-amber-500 hover:bg-amber-600 text-stone-900 font-medium border-0'>
              Get Started <ArrowRight className='w-4 h-4' />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className='flex-1 flex flex-col items-center justify-center text-center px-6 py-20 max-w-5xl mx-auto z-10'>
        <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/50 backdrop-blur-md text-amber-700 text-xs font-semibold mb-6 border border-amber-200/50 shadow-[0_4px_12px_rgba(245,158,11,0.05)]'>
          <Sparkles className='w-3.5 h-3.5' /> Visual Drag & Drop AI Builder
        </div>

        <h1 className='text-4xl sm:text-6xl font-extrabold tracking-tight text-stone-900 leading-tight'>
          Build & Deploy Autonomous{' '}
          <span className='text-transparent bg-clip-text bg-linear-to-r from-amber-500 to-orange-600'>
            AI Agents
          </span>{' '}
          in Minutes
        </h1>

        <p className='mt-6 text-base sm:text-lg text-stone-500 max-w-2xl leading-relaxed'>
          Connect AI models, branching conditionals, external REST APIs, and approval steps using an intuitive visual node canvas. Export production-ready code with a single click.
        </p>

        <div className='mt-8 flex flex-wrap items-center justify-center gap-4'>
          <Link href={isSignedIn ? '/dashboard' : '/sign-up'}>
            <Button size='lg' className='h-12 px-8 text-base shadow-lg cursor-pointer gap-2 bg-amber-500 hover:bg-amber-600 text-stone-900 font-medium border-0'>
              Start Building Free <ArrowRight className='w-4 h-4' />
            </Button>
          </Link>
          <Link href='/dashboard/pricing'>
            <Button size='lg' variant='outline' className='h-12 px-8 text-base cursor-pointer border-amber-300 text-stone-700 hover:bg-amber-50 hover:text-stone-900'>
              View Pricing
            </Button>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left w-full'>
          <div className='p-6 rounded-3xl bg-white/60 backdrop-blur-lg border border-amber-200/50 shadow-[0_8px_32px_rgba(245,158,11,0.04)] flex flex-col gap-3 transition-transform hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(245,158,11,0.08)]'>
            <div className='w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600'>
              <Workflow className='w-5 h-5' />
            </div>
            <h3 className='font-bold text-base text-stone-900'>Node-Based Workflows</h3>
            <p className='text-xs text-stone-500 leading-relaxed'>
              Drag and connect agents, while loops, conditionals, and webhooks on a React Flow visual canvas.
            </p>
          </div>

          <div className='p-6 rounded-3xl bg-white/60 backdrop-blur-lg border border-amber-200/50 shadow-[0_8px_32px_rgba(245,158,11,0.04)] flex flex-col gap-3 transition-transform hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(245,158,11,0.08)]'>
            <div className='w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600'>
              <Bot className='w-5 h-5' />
            </div>
            <h3 className='font-bold text-base text-stone-900'>OpenAI Agent SDK</h3>
            <p className='text-xs text-stone-500 leading-relaxed'>
              Native multi-agent coordination, sub-agent handoffs, and live streaming token responses.
            </p>
          </div>

          <div className='p-6 rounded-3xl bg-white/60 backdrop-blur-lg border border-amber-200/50 shadow-[0_8px_32px_rgba(245,158,11,0.04)] flex flex-col gap-3 transition-transform hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(245,158,11,0.08)]'>
            <div className='w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600'>
              <Zap className='w-5 h-5' />
            </div>
            <h3 className='font-bold text-base text-stone-900'>Instant SDK Integration</h3>
            <p className='text-xs text-stone-500 leading-relaxed'>
              Publish and integrate your live agents directly into any frontend with minimal lines of code.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='py-6 border-t border-amber-200/50 bg-[#FAF7F2]/80 backdrop-blur-md text-center text-xs text-stone-500 z-10'>
        © {new Date().getFullYear()} Agentify. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;