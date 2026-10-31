import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../../api';
import { Input, Button } from '../../components/ui';
import { Envelope, ArrowLeft, CheckCircle } from '@phosphor-icons/react';
import { DemoEmailInbox } from '../../components/demo/DemoEmailInbox';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailInboxOpen, setEmailInboxOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      await api.forgotPassword(email.trim());
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-8">
      <div className="space-y-2 border-b-2 border-ink-primary pb-6 text-center">
        <h1 className="font-display font-black text-5xl sm:text-6xl uppercase tracking-tight text-ink-primary leading-none">
          Recover Password
        </h1>
        <p className="font-sans text-sm sm:text-base text-ink-secondary">
          Enter your email address and we will send you a link to choose a new password.
        </p>
      </div>

      <div
        className="bg-white border-2 border-ink-primary p-6 sm:p-8 shadow-ticket space-y-5"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
        }}
      >
        {isSubmitted ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-14 h-14 mx-auto bg-green-50 text-role-volunteer border-2 border-role-volunteer flex items-center justify-center">
              <CheckCircle className="w-8 h-8" weight="fill" />
            </div>
            <h3 className="font-display text-3xl font-black uppercase text-ink-primary">
              Check Your Email
            </h3>
            <p className="font-sans text-xs sm:text-sm text-ink-secondary leading-relaxed">
              If an account exists for <strong className="font-mono text-ink-primary">{email}</strong>, we have sent a reset link to your inbox.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setEmailInboxOpen(true)}
              >
                Preview Reset Email
              </Button>
              <Link
                to="/sign-in"
                className="font-sans text-xs font-bold text-ink-secondary hover:text-ink-primary pt-2 block"
              >
                &larr; Back to sign in
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block font-sans text-xs font-bold uppercase tracking-tight text-ink-primary">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. dawit@example.com"
                leftIcon={<Envelope className="w-4 h-4 text-ink-secondary" />}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full text-base font-bold"
              isLoading={isLoading}
            >
              Send Reset Link
            </Button>

            <div className="pt-2 text-center border-t border-border">
              <Link
                to="/sign-in"
                className="font-sans text-xs font-bold text-ink-secondary hover:text-ink-primary inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to sign in</span>
              </Link>
            </div>
          </form>
        )}
      </div>

      <DemoEmailInbox
        isOpen={emailInboxOpen}
        onClose={() => setEmailInboxOpen(false)}
      />
    </div>
  );
};
