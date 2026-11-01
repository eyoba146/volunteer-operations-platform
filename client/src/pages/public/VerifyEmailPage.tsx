import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import * as api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { PageShell, Button, Raised, Panel, TopoBackdrop } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { Envelope, ArrowRight } from '@phosphor-icons/react';
import { DemoEmailInbox } from '../../components/demo/DemoEmailInbox';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const codeParam = searchParams.get('code') || '';

  const [email] = useState(emailParam);
  const [code, setCode] = useState(codeParam);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const [emailInboxOpen, setEmailInboxOpen] = useState(false);

  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (codeParam) {
      setCode(codeParam);
    }
  }, [codeParam]);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);
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
      toast.success('Your email has been verified. Welcome!');
      navigate('/applicant/status');
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed. Please check the code and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    setIsResending(true);
    setErrorMessage('');

    try {
      const codeResult = await api.resendVerificationCode(email);
      setResendCountdown(60);
      toast.success(
        `New verification code (${codeResult}) generated. Check the preview email inbox.`,
        'Code Resent'
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not resend verification code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <PageShell page="public/verify-email" signature="none:verification-form">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-6">
        {/* Header */}
        <div className="space-y-2 border-b border-[#EDEFF2] pb-6 text-center">
          <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-ink-primary leading-tight">
            Confirm your email
          </h1>
          <p className="font-sans text-base text-ink-secondary">
            Enter the 6-digit verification code sent to{' '}
            <strong className="text-ink-primary">{email || 'your email'}</strong>.
          </p>
        </div>

        {/* Verification Card */}
        <Raised className="relative overflow-hidden p-6 sm:p-8 space-y-6">
          <TopoBackdrop color="#16A34A" opacity={0.05} />
          <div className="relative z-10">
            <form onSubmit={handleVerify} className="space-y-5">
              {errorMessage && (
                <div className="p-3.5 bg-rose-50 rounded-[8px] text-rose-700 text-sm font-semibold">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-2">
                <label className="block font-sans text-sm font-bold tracking-tight text-ink-primary">
                  6-digit verification code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full text-center font-sans text-3xl sm:text-4xl tracking-widest font-bold py-3 px-4 border border-[#CBD2DA] rounded-[8px] bg-white text-ink-primary focus:border-ink-primary focus:ring-2 focus:ring-ink-primary/10 outline-none"
                  autoFocus
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-5 h-5" weight="bold" />}
              >
                Confirm and continue
              </Button>

              {/* Quick Evaluator Simulator Helper */}
              <Panel padding="sm" className="flex items-center justify-between text-[13px]">
                <span className="font-sans font-semibold text-ink-secondary">
                  Need to see the simulated email?
                </span>
                <button
                  type="button"
                  onClick={() => setEmailInboxOpen(true)}
                  className="text-ink-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Envelope className="w-4 h-4 text-role-applicant" weight="bold" />
                  <span>Preview emails</span>
                </button>
              </Panel>

              <div className="pt-2 text-center text-[13px] font-sans text-ink-secondary border-t border-[#EDEFF2] flex items-center justify-between">
                <span>Did not receive code?</span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCountdown > 0 || isResending}
                  className="font-bold text-ink-primary disabled:text-ink-tertiary cursor-pointer hover:underline"
                >
                  {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend code'}
                </button>
              </div>
            </form>
          </div>
        </Raised>

        <DemoEmailInbox
          isOpen={emailInboxOpen}
          onClose={() => setEmailInboxOpen(false)}
        />
      </div>
    </PageShell>
  );
};
