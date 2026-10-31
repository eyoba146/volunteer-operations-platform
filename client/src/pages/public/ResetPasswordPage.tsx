import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import * as api from '../../api';
import { Input, Button } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { Key, CheckCircle, ArrowRight } from '@phosphor-icons/react';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [email] = useState(searchParams.get('email') || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('The passwords entered do not match. Please re-enter them.');
      return;
    }

    setIsLoading(true);
    try {
      await api.resetPassword(email, newPassword);
      setIsSuccess(true);
      toast.success('Your password has been changed successfully. You can now sign in.');
    } catch (err: any) {
      setErrorMessage(err.message || 'We could not reset your password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-8">
      <div className="space-y-2 border-b-2 border-ink-primary pb-6 text-center">
        <h1 className="font-display font-black text-5xl sm:text-6xl uppercase tracking-tight text-ink-primary leading-none">
          Set New Password
        </h1>
        <p className="font-sans text-sm sm:text-base text-ink-secondary">
          Enter and confirm your new account password below.
        </p>
      </div>

      <div
        className="bg-white border-2 border-ink-primary p-6 sm:p-8 shadow-ticket space-y-6"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
        }}
      >
        {isSuccess ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-14 h-14 mx-auto bg-green-50 text-role-volunteer border-2 border-role-volunteer flex items-center justify-center">
              <CheckCircle className="w-8 h-8" weight="fill" />
            </div>
            <h3 className="font-display text-3xl font-black uppercase text-ink-primary">
              Password Updated
            </h3>
            <p className="font-sans text-xs sm:text-sm text-ink-secondary leading-relaxed">
              Your password has been reset. You can now sign in to your volunteer account.
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                className="w-full font-bold"
                onClick={() => navigate('/sign-in')}
                rightIcon={<ArrowRight className="w-4 h-4" weight="bold" />}
              >
                Sign In Now
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div className="p-4 bg-red-50 border-2 border-role-teamlead text-role-teamlead text-xs font-sans font-bold">
                {errorMessage}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block font-sans text-xs font-bold uppercase tracking-tight text-ink-primary">
                New Password
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                leftIcon={<Key className="w-4 h-4 text-ink-secondary" />}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-sans text-xs font-bold uppercase tracking-tight text-ink-primary">
                Confirm New Password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                leftIcon={<Key className="w-4 h-4 text-ink-secondary" />}
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
              Update Password
            </Button>

            <div className="pt-2 text-center border-t border-border">
              <Link
                to="/sign-in"
                className="font-sans text-xs font-bold text-ink-secondary hover:text-ink-primary"
              >
                Cancel and return to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
