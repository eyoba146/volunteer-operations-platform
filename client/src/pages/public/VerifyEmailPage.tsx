import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import * as api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { Envelope, ArrowClockwise, Check, ArrowRight } from '@phosphor-icons/react';
import { DemoEmailInbox } from '../../components/demo/DemoEmailInbox';

export const VerifyEmailPage: React.FC = () => {
  const { refreshUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [code, setCode] = useState(searchParams.get('code') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [errorMessage, setErrorMessage] = useState('');
  const [emailInboxOpen, setEmailInboxOpen] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    let timer: any;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!code || code.trim().length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    try {
      await api.verifyEmail(email, code.trim());
      await refreshUser();
      toast.success('Your email is confirmed. Welcome to the trail!');
      navigate('/applicant/apply');
    } catch (err: any) {
      setErrorMessage(err.message || 'The verification code you entered is invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0 || isResending) return;
    setIsResending(true);
    setErrorMessage('');

    try {
      const newCode = await api.resendVerificationCode(email);
      setResendCountdown(60);
      setCode(newCode);
      toast.success(`A fresh 6-digit code (${newCode}) has been dispatched.`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not resend verification email.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b-2 border-ink-primary pb-6 text-center">
        <h1 className="font-display font-black text-5xl sm:text-6xl tracking-tight text-ink-primary leading-none">
          Confirm Your Email
        </h1>
        <p className="font-sans text-sm sm:text-base text-ink-secondary">
          We sent a 6-digit code to <strong className="font-mono text-ink-primary">{email || 'your email'}</strong>.
        </p>
      </div>

      {/* Ticket Container */}
      <div
        className="bg-white border-2 border-ink-primary p-6 sm:p-8 shadow-ticket space-y-6"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
        }}
      >
        <form onSubmit={handleVerify} className="space-y-6">
          {errorMessage && (
            <div className="p-4 bg-red-50 border-2 border-role-teamlead text-role-teamlead text-xs font-sans font-bold">
              {errorMessage}
            </div>
          )}

          <div className="space-y-2 text-center">
            <label className="block font-sans text-xs font-bold tracking-tight text-ink-primary">
              6-Digit Verification Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full text-center font-mono text-3xl sm:text-4xl tracking-widest font-black py-3 px-4 border-2 border-ink-primary bg-canvas-inset text-ink-primary focus:border-role-applicant outline-none"
              autoFocus
              required
            />
          </div>

          <Button
            type="submit"
            variant="saffron"
            size="lg"
            className="w-full text-base font-bold"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" weight="bold" />}
          >
            Confirm & Continue
          </Button>

          {/* Quick Evaluator Simulator Helper */}
          <div className="p-3 bg-canvas-subdued border border-border flex items-center justify-between text-xs">
            <span className="font-sans font-bold text-ink-secondary">
              Need to see the simulated email?
            </span>
            <button
              type="button"
              onClick={() => setEmailInboxOpen(true)}
              className="text-role-applicant font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Envelope className="w-4 h-4" weight="bold" />
              <span>Preview Emails</span>
            </button>
          </div>

          <div className="pt-2 text-center text-xs font-sans text-ink-secondary border-t border-border flex items-center justify-between">
            <span>Did not receive code?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCountdown > 0 || isResending}
              className="font-bold text-ink-primary disabled:text-ink-tertiary cursor-pointer hover:underline"
            >
              {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend Code'}
            </button>
          </div>
        </form>
      </div>

      <DemoEmailInbox
        isOpen={emailInboxOpen}
        onClose={() => setEmailInboxOpen(false)}
      />
    </div>
  );
};
