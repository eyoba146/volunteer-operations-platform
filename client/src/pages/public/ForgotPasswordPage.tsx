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
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-6">
      <div className="space-y-2 border-b border-[#D5DAE1] pb-6 text-center">
        <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-ink-primary leading-tight">
          Recover password
        </h1>
        <p className="font-sans text-base text-ink-secondary">
          Enter your email address and we will send you a link to choose a new password.
        </p>
      </div>

      <div className="bg-white border border-[#D5DAE1] rounded-[10px] p-6 sm:p-8 space-y-5">
        {isSubmitted ? (
          <div className="space-y-4 text-center py-2">
            <div className="w-12 h-12 mx-auto bg-green-50 text-role-volunteer border border-role-volunteer rounded-[8px] flex items-center justify-center">
              <CheckCircle className="w-6 h-6" weight="fill" />
            </div>
            <h3 className="font-display text-2xl font-bold text-ink-primary">
              Check your email
            </h3>
            <p className="font-sans text-sm text-ink-secondary leading-relaxed">
              If an account exists for <strong className="font-sans font-bold text-ink-primary">{email}</strong>, we have sent a reset link to your inbox.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setEmailInboxOpen(true)}
              >
                Preview reset email
              </Button>
              <Link
                to="/sign-in"
                className="font-sans text-[13px] font-semibold text-ink-secondary hover:text-ink-primary pt-2 block"
              >
                &larr; Back to sign in
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. dawit@example.com"
              leftIcon={<Envelope className="w-4 h-4 text-ink-secondary" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Send reset link
            </Button>

            <div className="pt-2 text-center border-t border-[#D5DAE1]">
              <Link
                to="/sign-in"
                className="font-sans text-[13px] font-semibold text-ink-secondary hover:text-ink-primary inline-flex items-center gap-1"
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
