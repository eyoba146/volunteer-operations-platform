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
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center pb-2">
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight text-slate-900 leading-none">
          Join as Volunteer
        </h1>
        <p className="font-sans text-sm text-slate-500 max-w-sm mx-auto">
          Sign up in 60 seconds to start logging your community hours.
        </p>
      </div>

      {/* Main Register Form */}
      <div className="bg-white rounded-[24px] shadow-soft border border-slate-100 p-6 sm:p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-[14px] text-rose-700 text-xs font-sans">
              {errorMessage}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block font-sans text-xs font-semibold text-slate-700">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. dawit@example.com"
              leftIcon={<Envelope className="w-4 h-4 text-slate-400" />}
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-sans text-xs font-semibold text-slate-700">
              Choose Username
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. dawit.bekele"
              leftIcon={<UserIcon className="w-4 h-4 text-slate-400" />}
              autoComplete="username"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-sans text-xs font-semibold text-slate-700">
              Create Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              leftIcon={<Key className="w-4 h-4 text-slate-400" />}
              autoComplete="new-password"
              required
            />

            {/* Password Criteria Checklist */}
            <div className="p-3 bg-slate-50 rounded-[14px] text-xs font-sans space-y-1 text-slate-600">
              <div className="flex items-center gap-1.5">
                {hasMinLength ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" weight="bold" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
                <span>At least 8 characters</span>
              </div>
              <div className="flex items-center gap-1.5">
                {hasNumber ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" weight="bold" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
                <span>Includes a number (0-9)</span>
              </div>
              <div className="flex items-center gap-1.5">
                {hasUppercase ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" weight="bold" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
                <span>Includes an uppercase letter</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" weight="bold" />}
            >
              Continue to Verification
            </Button>
          </div>
        </form>

        <div className="text-center pt-4 border-t border-slate-100 text-xs text-slate-500 font-sans">
          Already have an account?{' '}
          <Link to="/sign-in" className="font-semibold text-brand hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
