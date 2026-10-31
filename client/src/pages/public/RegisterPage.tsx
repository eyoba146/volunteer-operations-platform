import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as api from '../../api';
import { Input, Button } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { validateAndNormalizeEthiopianPhone } from '../../utils/phone';
import {
  Envelope,
  User as UserIcon,
  Phone,
  Lock,
  Eye,
  EyeSlash,
  Check,
  X,
  ArrowRight,
} from '@phosphor-icons/react';

export const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field touch tracking
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const navigate = useNavigate();
  const toast = useToast();

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Validations
  // 1. Names: 2 to 40 characters, letters (any alphabet), spaces, hyphens and apostrophes only.
  const nameRegex = /^[\p{L}\s\-']{2,40}$/u;
  const isFirstNameValid = nameRegex.test(firstName.trim());
  const firstNameError =
    touched.firstName && !isFirstNameValid
      ? firstName.trim().length < 2
        ? 'First name must be at least 2 characters.'
        : 'Use letters, spaces, hyphens or apostrophes only.'
      : undefined;

  const isLastNameValid = nameRegex.test(lastName.trim());
  const lastNameError =
    touched.lastName && !isLastNameValid
      ? lastName.trim().length < 2
        ? 'Last name must be at least 2 characters.'
        : 'Use letters, spaces, hyphens or apostrophes only.'
      : undefined;

  // 2. Username: 3 to 20 characters, letters, numbers, dots and underscores.
  const usernameFormatValid = /^[a-zA-Z0-9._]{3,20}$/.test(username.trim());
  let usernameError: string | undefined = undefined;
  if (touched.username) {
    if (!usernameFormatValid) {
      usernameError = 'Username must be 3–20 characters using letters, numbers, dots or underscores.';
    } else {
      const dup = api.checkDuplicate('username', username.trim());
      if (dup) usernameError = dup;
    }
  }
  const isUsernameValid = usernameFormatValid && !usernameError;

  // 3. Email: valid format and duplicate check
  const emailFormatValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  let emailError: string | undefined = undefined;
  if (touched.email) {
    if (!emailFormatValid) {
      emailError = 'Please enter a valid email address.';
    } else {
      const dup = api.checkDuplicate('email', email.trim());
      if (dup) emailError = dup;
    }
  }
  const isEmailValid = emailFormatValid && !emailError;

  // 4. Phone: Ethiopian mobile number validation and duplicate check
  const phoneValidation = validateAndNormalizeEthiopianPhone(phone);
  let phoneError: string | undefined = undefined;
  if (touched.phone) {
    if (!phoneValidation.isValid) {
      phoneError = phoneValidation.error;
    } else {
      const dup = api.checkDuplicate('phone', phoneValidation.normalized);
      if (dup) phoneError = dup;
    }
  }
  const isPhoneValid = phoneValidation.isValid && !phoneError;

  // 5. Password: 8+ chars, 1 letter, 1 number
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordSecure = hasMinLength && hasLetter && hasNumber;
  const passwordError =
    touched.password && !isPasswordSecure
      ? 'Password must have 8+ characters, at least 1 letter, and 1 number.'
      : undefined;

  // 6. Confirm Password match
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const confirmError =
    touched.confirmPassword && !doPasswordsMatch
      ? 'Passwords do not match.'
      : undefined;

  const isFormValid =
    isFirstNameValid &&
    isLastNameValid &&
    isUsernameValid &&
    isEmailValid &&
    isPhoneValid &&
    isPasswordSecure &&
    doPasswordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    setTouched({
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });

    if (!isFormValid) {
      setServerError('Please correct the highlighted fields before submitting.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await api.register(
        firstName,
        lastName,
        username,
        email,
        phone,
        password
      );

      toast.success(
        `Verification code (${result.verificationCode}) sent to your preview inbox.`,
        'Account Registered'
      );

      navigate(
        `/verify-email?email=${encodeURIComponent(result.user.email)}&code=${result.verificationCode}`
      );
    } catch (err: any) {
      setServerError(err.message || 'We could not complete your registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-6">
      {/* Editorial Header */}
      <div className="space-y-2 border-b border-[#D5DAE1] pb-6 text-center">
        <div className="inline-block px-3 py-1 bg-canvas-subdued text-ink-primary font-semibold text-[13px] rounded-[6px] border border-[#D5DAE1] mb-2">
          New volunteer pass
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink-primary tracking-tight">
          Join the volunteer trail
        </h1>
        <p className="font-sans text-base text-ink-secondary max-w-md mx-auto">
          Create your profile to start enrolling in community activities, logging verified service hours, and earning rank milestones.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white border border-[#D5DAE1] rounded-[10px] p-6 sm:p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {serverError && (
            <div className="p-3.5 bg-red-50 border border-role-teamlead rounded-[8px] text-role-teamlead text-sm font-semibold flex items-start gap-2.5">
              <X className="w-5 h-5 shrink-0 mt-0.5" weight="bold" />
              <span>{serverError}</span>
            </div>
          )}

          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={() => markTouched('firstName')}
              placeholder="e.g. Dawit"
              error={firstNameError}
              required
            />
            <Input
              label="Last name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onBlur={() => markTouched('lastName')}
              placeholder="e.g. Bekele"
              error={lastNameError}
              required
            />
          </div>

          {/* Username & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => markTouched('username')}
              placeholder="e.g. dawit.bekele"
              leftIcon={<UserIcon className="w-4 h-4 text-ink-secondary" weight="bold" />}
              error={usernameError}
              hint="3–20 letters, numbers, dots or underscores"
              required
            />
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => markTouched('email')}
              placeholder="e.g. dawit@example.com"
              leftIcon={<Envelope className="w-4 h-4 text-ink-secondary" weight="bold" />}
              error={emailError}
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <Input
              label="Phone number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={() => markTouched('phone')}
              placeholder="0912 345 678"
              leftIcon={<Phone className="w-4 h-4 text-ink-secondary" weight="bold" />}
              error={phoneError}
              hint={
                phoneValidation.isValid
                  ? `Normalized to ${phoneValidation.normalized}`
                  : 'Ethiopian mobile: 09XX or 07XX (e.g. 0912 345 678)'
              }
              required
            />
          </div>

          {/* Password & Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => markTouched('password')}
                placeholder="At least 8 characters"
                leftIcon={<Lock className="w-4 h-4 text-ink-secondary" weight="bold" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-ink-secondary hover:text-ink-primary cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeSlash className="w-4 h-4" weight="bold" /> : <Eye className="w-4 h-4" weight="bold" />}
                  </button>
                }
                error={passwordError}
                required
              />
            </div>

            <div>
              <Input
                label="Confirm password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => markTouched('confirmPassword')}
                placeholder="Re-type password"
                leftIcon={<Lock className="w-4 h-4 text-ink-secondary" weight="bold" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="p-1 text-ink-secondary hover:text-ink-primary cursor-pointer"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeSlash className="w-4 h-4" weight="bold" /> : <Eye className="w-4 h-4" weight="bold" />}
                  </button>
                }
                error={confirmError}
                required
              />
            </div>
          </div>

          {/* Live Password Checklist */}
          <div className="p-4 bg-canvas-subdued border border-[#D5DAE1] rounded-[8px] space-y-2">
            <span className="block font-sans text-[13px] font-bold text-ink-primary tracking-tight">
              Password requirements
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[13px]">
              <div
                className={`flex items-center gap-1.5 font-semibold ${
                  hasMinLength ? 'text-role-volunteer' : 'text-ink-tertiary'
                }`}
              >
                {hasMinLength ? <Check className="w-4 h-4" weight="bold" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                <span>8+ characters</span>
              </div>
              <div
                className={`flex items-center gap-1.5 font-semibold ${
                  hasLetter ? 'text-role-volunteer' : 'text-ink-tertiary'
                }`}
              >
                {hasLetter ? <Check className="w-4 h-4" weight="bold" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                <span>At least 1 letter</span>
              </div>
              <div
                className={`flex items-center gap-1.5 font-semibold ${
                  hasNumber ? 'text-role-volunteer' : 'text-ink-tertiary'
                }`}
              >
                {hasNumber ? <Check className="w-4 h-4" weight="bold" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                <span>At least 1 number</span>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              disabled={!isFormValid}
              rightIcon={<ArrowRight className="w-5 h-5" weight="bold" />}
            >
              Create volunteer account
            </Button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="pt-4 border-t border-[#D5DAE1] flex flex-col sm:flex-row items-center justify-between text-sm text-ink-secondary gap-2">
          <span>Already registered?</span>
          <Link
            to="/sign-in"
            className="font-semibold text-ink-primary hover:underline"
          >
            Sign in to existing account →
          </Link>
        </div>
      </div>
    </div>
  );
};
