import { User, Role } from '../types';
import { store } from './store';
import { delay } from './delay';

export async function signIn(identifier: string, password: string): Promise<User> {
  await delay(350, 700);
  const state = store.getState();
  const lower = identifier.trim().toLowerCase();
  
  const user = state.users.find(
    (u) => (u.username.toLowerCase() === lower || u.email.toLowerCase() === lower)
  );

  if (!user) {
    throw new Error('We could not find an account with that email or username.');
  }

  if (user.accountStatus === 'suspended') {
    throw new Error('This account has been paused. Please speak to the program administrator.');
  }

  // Password check: in demo, Demo@1234 works for all, or exact match
  if (user.passwordHash && user.passwordHash !== password && password !== 'Demo@1234') {
    throw new Error('The password you entered is incorrect. Please try again.');
  }

  // Update lastSignInAt
  const updatedUser: User = {
    ...user,
    lastSignInAt: new Date().toISOString(),
  };

  store.setState((prev) => ({
    ...prev,
    users: prev.users.map((u) => (u.id === user.id ? updatedUser : u)),
  }));

  store.setCurrentUser(updatedUser);
  return updatedUser;
}

export async function register(
  email: string,
  username: string,
  password: string
): Promise<{ user: User; verificationCode: string }> {
  await delay(400, 800);
  const state = store.getState();
  const lowerEmail = email.trim().toLowerCase();
  const lowerUsername = username.trim().toLowerCase();

  if (state.users.some((u) => u.email.toLowerCase() === lowerEmail)) {
    throw new Error('An account with this email address already exists.');
  }

  if (state.users.some((u) => u.username.toLowerCase() === lowerUsername)) {
    throw new Error('This username is already taken. Please choose another.');
  }

  const newId = `usr-${Date.now()}`;
  const now = new Date().toISOString();
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  const newUser: User = {
    id: newId,
    username: lowerUsername,
    email: lowerEmail,
    passwordHash: password,
    role: 'applicant',
    accountStatus: 'unverified',
    createdAt: now,
  };

  // Add initial email
  const newEmail = {
    id: `em-${Date.now()}`,
    to: lowerEmail,
    toName: username,
    subject: 'Welcome to VTS — Your 6-Digit Email Verification Code',
    category: 'verification' as const,
    sentAt: now,
    read: false,
    code: verificationCode,
    body: `Hello ${username},\n\nThank you for beginning your registration with VTS.\n\nYour 6-digit verification code is: ${verificationCode}\n\nThis code is valid for 15 minutes. Enter it to activate your account access.\n\nWarm regards,\nVTS Admissions Team`,
    actionLabel: 'Verify Email',
    actionUrl: `/verify-email?code=${verificationCode}&email=${encodeURIComponent(lowerEmail)}`,
  };

  store.setState((prev) => ({
    ...prev,
    users: [...prev.users, newUser],
    emails: [newEmail, ...prev.emails],
    activityLog: [
      {
        id: `log-${Date.now()}`,
        actorId: newId,
        actorName: username,
        actorRole: 'Applicant',
        action: 'Registered new applicant account',
        subject: lowerEmail,
        createdAt: now,
      },
      ...prev.activityLog,
    ],
  }));

  return { user: newUser, verificationCode };
}

export async function verifyEmail(email: string, code: string): Promise<User> {
  await delay(350, 700);
  const state = store.getState();
  const lowerEmail = email.trim().toLowerCase();
  const user = state.users.find((u) => u.email.toLowerCase() === lowerEmail);

  if (!user) {
    throw new Error('Account not found for verification.');
  }

  // Find verification email with this code
  const emailItem = state.emails.find(
    (e) => e.to.toLowerCase() === lowerEmail && e.code === code
  );

  // In demo, 6-digit code or exact matches
  if (!emailItem && code.length !== 6) {
    throw new Error('The 6-digit code is incorrect or expired. Please request a new one.');
  }

  const updatedUser: User = {
    ...user,
    accountStatus: 'active',
    emailVerifiedAt: new Date().toISOString(),
  };

  store.setState((prev) => ({
    ...prev,
    users: prev.users.map((u) => (u.id === user.id ? updatedUser : u)),
  }));

  store.setCurrentUser(updatedUser);
  return updatedUser;
}

export async function resendVerificationCode(email: string): Promise<string> {
  await delay(300, 600);
  const state = store.getState();
  const lowerEmail = email.trim().toLowerCase();
  const user = state.users.find((u) => u.email.toLowerCase() === lowerEmail);

  if (!user) {
    throw new Error('We could not find an account with that email.');
  }

  const newCode = Math.floor(100000 + Math.random() * 900000).toString();
  const now = new Date().toISOString();

  const newEmail = {
    id: `em-${Date.now()}`,
    to: lowerEmail,
    toName: user.username,
    subject: 'New Verification Code for VTS',
    category: 'verification' as const,
    sentAt: now,
    read: false,
    code: newCode,
    body: `Hello ${user.username},\n\nHere is your new 6-digit verification code: ${newCode}\n\nEnter this code within 15 minutes to complete your account setup.\n\nWarm regards,\nVTS Admissions Team`,
    actionLabel: 'Verify Email',
    actionUrl: `/verify-email?code=${newCode}&email=${encodeURIComponent(lowerEmail)}`,
  };

  store.setState((prev) => ({
    ...prev,
    emails: [newEmail, ...prev.emails],
  }));

  return newCode;
}

export async function forgotPassword(email: string): Promise<void> {
  await delay(400, 750);
  const state = store.getState();
  const lowerEmail = email.trim().toLowerCase();
  const user = state.users.find((u) => u.email.toLowerCase() === lowerEmail);

  if (!user) {
    // For privacy we do not fail with error, but do nothing
    return;
  }

  const resetToken = `rst-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date().toISOString();

  const resetEmail = {
    id: `em-${Date.now()}`,
    to: lowerEmail,
    toName: user.username,
    subject: 'Reset Your VTS Account Password',
    category: 'password_reset' as const,
    sentAt: now,
    read: false,
    code: resetToken,
    body: `Hello ${user.username},\n\nWe received a request to reset your password for the Volunteer Tracking System.\n\nClick the link below or enter token ${resetToken} to set a new password:\n\nIf you did not request this, you can safely ignore this email.`,
    actionLabel: 'Reset Password',
    actionUrl: `/reset-password?token=${resetToken}&email=${encodeURIComponent(lowerEmail)}`,
  };

  store.setState((prev) => ({
    ...prev,
    emails: [resetEmail, ...prev.emails],
  }));
}

export async function resetPassword(email: string, newPassword: string): Promise<void> {
  await delay(400, 800);
  const state = store.getState();
  const lowerEmail = email.trim().toLowerCase();
  const user = state.users.find((u) => u.email.toLowerCase() === lowerEmail);

  if (!user) {
    throw new Error('We could not find an account associated with this email address.');
  }

  store.setState((prev) => ({
    ...prev,
    users: prev.users.map((u) =>
      u.id === user.id ? { ...u, passwordHash: newPassword } : u
    ),
    activityLog: [
      {
        id: `log-${Date.now()}`,
        actorId: user.id,
        actorName: user.username,
        actorRole: user.role,
        action: 'Reset account password',
        subject: user.email,
        createdAt: new Date().toISOString(),
      },
      ...prev.activityLog,
    ],
  }));
}

export function getCurrentUserSync(): User | null {
  return store.getCurrentUser();
}

export async function getCurrentUser(): Promise<User | null> {
  await delay(100, 250);
  return store.getCurrentUser();
}

export async function signOut(): Promise<void> {
  await delay(150, 300);
  store.setCurrentUser(null);
}

