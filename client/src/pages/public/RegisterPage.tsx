import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as api from '../../api';
import { Input, Button } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { Envelope, User as UserIcon, Key, Check, X, ArrowRight } from '@phosphor-icons/react';

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const toast = useToast();

  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const isPasswordValid = hasMinLength && hasNumber && hasUppercase;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!username.trim() || username.length < 3) {
      setErrorMessage('Please choose a username of at least 3 characters.');
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage('Please ensure your password meets all requirements below.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await api.register(email, username, password);
      toast.success(
        `A 6-digit code (${result.verificationCode}) has been simulated in your preview inbox.`,
        'Check Your Email'
      );
      navigate(
        `/verify-email?email=${encodeURIComponent(result.user.email)}&code=${result.verificationCode}`
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'We could not complete your registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-8">
      {/* Editorial Header */}
      <div className="space-y-2 border-b-2 border-ink-primary pb-6 text-center">
        <h1 className="font-display font-black text-5xl sm:text-6xl uppercase tracking-tight text-ink-primary leading-none">
          Join As Volunteer
        </h1>
        <p className="font-sans text-sm sm:text-base text-ink-secondary">
          Your time counts. Sign up in 60 seconds to start logging your community hours.
        </p>
      </div>

      {/* Ticket Pass Form Container */}
      <div
        className="bg-white border-2 border-ink-primary p-6 sm:p-8 shadow-ticket space-y-6"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage && (
            <div className="p-4 bg-red-50 border-2 border-role-teamlead text-role-teamlead text-xs font-sans font-bold">
              {errorMessage}
            </div>
          )}

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
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-sans text-xs font-bold uppercase tracking-tight text-ink-primary">
              Username
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. dawit.bekele"
              leftIcon={<UserIcon className="w-4 h-4 text-ink-secondary" />}
              autoComplete="username"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-sans text-xs font-bold uppercase tracking-tight text-ink-primary">
              Create Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              leftIcon={<Key className="w-4 h-4 text-ink-secondary" />}
              autoComplete="new-password"
              required
            />

            {/* Password Validation Indicators */}
            <div className="pt-2 grid grid-cols-3 gap-2 text-[11px] font-sans">
              <span className={`flex items-center gap-1 ${hasMinLength ? 'text-role-volunteer font-bold' : 'text-ink-tertiary'}`}>
                {hasMinLength ? <Check className="w-3.5 h-3.5" weight="bold" /> : <X className="w-3.5 h-3.5" />}
                8+ characters
              </span>
              <span className={`flex items-center gap-1 ${hasNumber ? 'text-role-volunteer font-bold' : 'text-ink-tertiary'}`}>
                {hasNumber ? <Check className="w-3.5 h-3.5" weight="bold" /> : <X className="w-3.5 h-3.5" />}
                One number
              </span>
              <span className={`flex items-center gap-1 ${hasUppercase ? 'text-role-volunteer font-bold' : 'text-ink-tertiary'}`}>
                {hasUppercase ? <Check className="w-3.5 h-3.5" weight="bold" /> : <X className="w-3.5 h-3.5" />}
                One capital letter
              </span>
            </div>
          </div>

          <Button
            type="submit"
            variant="saffron"
            size="lg"
            className="w-full text-base font-bold"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" weight="bold" />}
          >
            Create My Volunteer Pass
          </Button>

          <div className="pt-2 text-center text-xs font-sans text-ink-secondary border-t border-border">
            Already registered?{' '}
            <Link to="/sign-in" className="font-bold text-ink-primary underline underline-offset-2">
              Sign in to your account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
