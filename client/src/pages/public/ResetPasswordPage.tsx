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
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-6">
      <div className="space-y-2 border-b border-[#D5DAE1] pb-6 text-center">
        <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-ink-primary leading-tight">
          Set new password
        </h1>
        <p className="font-sans text-base text-ink-secondary">
          Enter and confirm your new account password below.
        </p>
      </div>

      <div className="bg-white border border-[#D5DAE1] rounded-[10px] p-6 sm:p-8 space-y-5">
        {isSuccess ? (
          <div className="space-y-4 text-center py-2">
            <div className="w-12 h-12 mx-auto bg-green-50 text-role-volunteer border border-role-volunteer rounded-[8px] flex items-center justify-center">
              <CheckCircle className="w-6 h-6" weight="fill" />
            </div>
            <h3 className="font-display text-2xl font-bold text-ink-primary">
              Password updated
            </h3>
            <p className="font-sans text-sm text-ink-secondary leading-relaxed">
              Your password has been reset. You can now sign in to your volunteer account.
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                className="w-full font-bold"
                onClick={() => navigate('/sign-in')}
                rightIcon={<ArrowRight className="w-5 h-5" weight="bold" />}
              >
                Sign in now
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-role-teamlead rounded-[8px] text-role-teamlead text-sm font-semibold">
                {errorMessage}
              </div>
            )}

            <Input
              label="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              leftIcon={<Key className="w-4 h-4 text-ink-secondary" weight="bold" />}
              required
            />

            <Input
              label="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your new password"
              leftIcon={<Key className="w-4 h-4 text-ink-secondary" weight="bold" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Update password
            </Button>

            <div className="pt-2 text-center border-t border-[#D5DAE1]">
              <Link
                to="/sign-in"
                className="font-sans text-[13px] font-semibold text-ink-secondary hover:text-ink-primary"
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
