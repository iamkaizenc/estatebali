'use client';

import { useState, useCallback, FormEvent, ChangeEvent } from 'react';
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
        <span className="text-[15px] font-medium tracking-tight text-neutral-800">
          Estate Bali
        </span>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 pb-24">
        <div className="w-full max-w-[560px]">
          {/* Hero Section */}
          <div className="text-center mb-10">
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
                <p className="text-[14px] text-neutral-500">
                  {submitState === 'success' ? "We'll be in touch soon." : "We'll reach out when it's your turn."}
                </p>
              </div>
            )}
          </div>

          {/* App Icon */}
          <div className="mt-8 flex justify-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3D7A5A] to-[#2D5A4A] shadow-sm flex items-center justify-center">
              <span className="text-white text-[20px] font-semibold">E</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-6 text-center">
        <p className="text-[13px] text-neutral-400">
          Bali, Indonesia • info@estatebali.app
        </p>
      </footer>
    </div>
  );
}
