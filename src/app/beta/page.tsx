'use client';

import { useState, useCallback, FormEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { isValidEmail } from '@/lib/validators';

type SubmitState = 'idle' | 'loading' | 'success' | 'duplicate' | 'error';

export default function BetaPage() {
  const [email, setEmail] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const isEmailValid = isValidEmail(email);
  const canSubmit = isEmailValid && submitState !== 'loading';

  const handleEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (submitState !== 'idle' && submitState !== 'loading') {
      setSubmitState('idle');
      setErrorMessage('');
    }
  }, [submitState]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitState('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setSubmitState('success');
      } else if (data.status === 'duplicate') {
        setSubmitState('duplicate');
      } else {
        setSubmitState('error');
        setErrorMessage(data.message || 'Something went wrong');
      }
    } catch {
      setSubmitState('error');
      setErrorMessage('Unable to connect. Please try again.');
    }
  }, [email, canSubmit]);

  const showForm = submitState !== 'success' && submitState !== 'duplicate';

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-5">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image 
            src="/logo.png" 
            alt="Estate Bali Logo" 
            width={120} 
            height={48}
            className="h-8 w-auto"
            priority
          />
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 pb-24">
        <div className="w-full max-w-[560px]">
          {/* Hero Section */}
          <div className="text-center mb-10">
            {/* Apple Logo and Estate Bali Logo */}
            <div className="flex justify-center items-center gap-4 mb-6">
              <svg className="w-12 h-12 text-neutral-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <Image 
                src="/logo.png" 
                alt="Estate Bali Logo" 
                width={48} 
                height={48}
                className="w-12 h-12 object-contain"
                priority
              />
            </div>
            <p className="text-[13px] font-medium tracking-wide text-[#3D7A5A] uppercase mb-3">
              Estate Bali
            </p>
            <h1 className="text-[32px] sm:text-[40px] font-semibold tracking-tight text-neutral-900 leading-tight mb-3">
              iOS Beta on TestFlight
            </h1>
            <p className="text-[17px] text-neutral-600 mb-2">
              Early access for selected users.
            </p>
            <p className="text-[14px] text-neutral-400">
              Help us shape the future of buying and renting in Bali.
            </p>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-xl border border-neutral-200/80 shadow-sm p-6 sm:p-8">
            {showForm ? (
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-5">
                  <label 
                    htmlFor="email" 
                    className="block text-[13px] font-medium text-neutral-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="you@domain.com"
                    autoComplete="email"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    disabled={submitState === 'loading'}
                    className="w-full h-12 px-4 text-[15px] text-neutral-900 placeholder:text-neutral-400 
                             bg-neutral-50 border border-neutral-200 rounded-lg
                             transition-all duration-150
                             hover:border-neutral-300
                             focus:outline-none focus:ring-2 focus:ring-[#3D7A5A]/20 focus:border-[#3D7A5A]
                             disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full h-12 px-6 text-[15px] font-medium text-white
                           bg-neutral-900 rounded-lg
                           transition-all duration-150
                           hover:bg-neutral-800
                           focus:outline-none focus:ring-2 focus:ring-neutral-900/20 focus:ring-offset-2
                           disabled:bg-neutral-300 disabled:cursor-not-allowed"
                >
                  {submitState === 'loading' ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Request beta access'
                  )}
                </button>

                <p className="mt-4 text-[13px] text-neutral-400 text-center">
                  We'll email you an invite if you're selected.
                </p>

                <div aria-live="polite" aria-atomic="true" className="min-h-[24px] mt-3">
                  {submitState === 'error' && errorMessage && (
                    <p className="text-[13px] text-red-600 text-center">{errorMessage}</p>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 text-[14px] font-medium text-neutral-600 hover:text-neutral-900 transition-colors duration-150"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                    Back to Home
                  </Link>
                </div>
              </form>
            ) : (
              <div className="py-4 text-center" role="status" aria-live="polite">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#3D7A5A]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#3D7A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <p className="text-[17px] font-medium text-neutral-900 mb-1">
                  {submitState === 'success' ? "You're on the waitlist." : "You're already on the list."}
                </p>
                <p className="text-[14px] text-neutral-500 mb-6">
                  {submitState === 'success' ? "We'll be in touch soon." : "We'll reach out when it's your turn."}
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 text-[15px] font-medium text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors duration-150"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                  </svg>
                  Back to Home
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-6 text-center">
        <p className="text-[13px] text-neutral-400">
          Bali, Indonesia • <a href="mailto:support@estatebali.app" className="hover:text-neutral-600 transition-colors">support@estatebali.app</a>
        </p>
      </footer>
    </div>
  );
}
