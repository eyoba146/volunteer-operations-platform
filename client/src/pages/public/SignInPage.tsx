import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input, Button, TopoBackdrop } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { Key, User as UserIcon, Eye, EyeSlash, ArrowRight, CaretDown, CaretUp, Sparkle, Envelope } from '@phosphor-icons/react';
import { DemoEmailInbox } from '../../components/demo/DemoEmailInbox';

const DEMO_PERSONAS = [
  {
    role: 'Applicant',
    name: 'Hana Tesfaye',
    username: 'hana.tesfaye',
    stage: 'Accepted • Ready to pay Telebirr fee',
    badgeClass: 'bg-role-applicant text-ink-primary font-bold',
  },
  {
    role: 'Volunteer (Member)',
    name: 'Dawit Bekele',
    username: 'dawit.bekele',
    stage: 'Active Member • Enrolled in cleanup',
    badgeClass: 'bg-role-volunteer text-white font-bold',
  },
  {
    role: 'Volunteer (Senior)',
    name: 'Selam Alemu',
    username: 'selam.alemu',
    stage: '168 hrs completed • Promotion pending',
    badgeClass: 'bg-amber-700 text-white font-bold',
  },
  {
    role: 'Team Lead',
    name: 'Yonas Kebede',
    username: 'yonas.kebede',
    stage: 'Field Coordinator • Approves hours & rates work',
    badgeClass: 'bg-role-teamlead text-white font-bold',
  },
  {
    role: 'Manager',
    name: 'Marta Girma',
    username: 'marta.girma',
    stage: 'Operations • Reviews applicants & promotions',
    badgeClass: 'bg-role-manager text-white font-bold',
  },
  {
    role: 'Finance Officer',
    name: 'Abel Hailu',
    username: 'abel.hailu',
    stage: 'Telebirr review • 2 flagged payments to review',
    badgeClass: 'bg-ink-primary text-white font-bold',
  },
  {
    role: 'Super Admin',
    name: 'Ruth Mengistu',
    username: 'ruth.mengistu',
    stage: 'Director • Calibrates fees & rank rules',
    badgeClass: 'bg-[#202328] text-white font-bold',
  },
];

export const SignInPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [identifier, setIdentifier] = useState(searchParams.get('account') || '');
  const [password, setPassword] = useState('Demo@1234');
  const [showPassword, setShowPassword] = useState(false);
  const [demoPanelOpen, setDemoPanelOpen] = useState(true);
  const [emailInboxOpen, setEmailInboxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  useEffect(() => {
    const acct = searchParams.get('account');
    if (acct) {
      setIdentifier(acct);
      setPassword('Demo@1234');
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      redirectToRoleHome(user.role);
    }
  }, [user]);

  const redirectToRoleHome = (role: string) => {
    const from = (location.state as any)?.from?.pathname;
    if (from && from !== '/unauthorized' && from !== '/sign-in') {
      navigate(from, { replace: true });
      return;
    }

    switch (role) {
      case 'applicant':
        navigate('/applicant/status', { replace: true });
        break;
      case 'volunteer':
        navigate('/volunteer/home', { replace: true });
        break;
      case 'team_lead':
        navigate('/team-lead/home', { replace: true });
        break;
      case 'manager':
        navigate('/manager/dashboard', { replace: true });
        break;
      case 'finance':
        navigate('/finance/overview', { replace: true });
        break;
      case 'admin':
        navigate('/admin/overview', { replace: true });
        break;
      default:
        navigate('/', { replace: true });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Please enter your username or email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const loggedIn = await signIn(identifier, password);
      toast.success(`Welcome back, ${loggedIn.username}!`);
      redirectToRoleHome(loggedIn.role);
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not sign in. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDemoAccount = (username: string) => {
    setIdentifier(username);
    setPassword('Demo@1234');
    setErrorMessage('');
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-6">
      {/* Editorial Header */}
      <div className="space-y-2 border-b border-[#EDEFF2] pb-6 text-center">
        
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink-primary tracking-tight">
          Sign in to your account
        </h1>
        <p className="font-sans text-base text-ink-secondary max-w-md mx-auto">
          Enter your credentials to access your activities, attendance record, and operations desk.
        </p>
      </div>

      {/* Collapsible Demo Evaluator Accounts Panel */}
      <div className="rounded-[16px] bg-[#F7F8FA] overflow-hidden border-none">
        <button
          type="button"
          onClick={() => setDemoPanelOpen(!demoPanelOpen)}
          className="w-full px-5 py-3.5 bg-canvas-subdued border-b border-[#EDEFF2] flex items-center justify-between font-display text-base font-bold text-ink-primary hover:bg-canvas-inset/50 transition-colors cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <Sparkle className="w-4 h-4 text-role-applicant" weight="fill" />
            <span>Demo evaluator accounts</span>
            <span className="font-sans text-[13px] px-2 py-0.5 bg-canvas-inset text-ink-secondary rounded-[4px] border border-[#D5DAE1] ml-1">
              Password: Demo@1234
            </span>
          </div>
          {demoPanelOpen ? <CaretUp className="w-4 h-4" weight="bold" /> : <CaretDown className="w-4 h-4" weight="bold" />}
        </button>

        {demoPanelOpen && (
          <div className="p-3 bg-white space-y-1.5 divide-y divide-[#EDEFF2]">
            {DEMO_PERSONAS.map((p) => (
              <button
                key={p.username}
                type="button"
                onClick={() => handleSelectDemoAccount(p.username)}
                className={`w-full pt-2.5 pb-2 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-[8px] hover:bg-canvas-subdued transition-colors cursor-pointer border ${
                  identifier === p.username ? 'bg-canvas-subdued border-ink-primary font-semibold' : 'border-transparent'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[13px] font-sans px-2 py-0.5 rounded-[4px] ${p.badgeClass}`}>
                      {p.role}
                    </span>
                    <span className="font-sans text-sm font-semibold text-ink-primary">
                      {p.name}
                    </span>
                  </div>
                  <span className="font-sans text-[13px] text-ink-secondary block">
                    {p.stage}
                  </span>
                </div>
                <div className="font-sans text-[13px] text-ink-secondary bg-canvas-inset px-2 py-1 rounded-[4px] border border-[#D5DAE1]">
                  {p.username}
                </div>
              </button>
            ))}

            {/* Email Inbox simulator trigger on Demo panel */}
            <div className="pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setEmailInboxOpen(true)}
                className="text-[13px] font-semibold text-ink-secondary hover:text-ink-primary flex items-center gap-1.5 py-1 px-2 rounded-[6px] border border-[#D5DAE1] hover:bg-canvas-subdued cursor-pointer"
              >
                <Envelope className="w-3.5 h-3.5 text-role-applicant" weight="bold" />
                <span>Preview transactional emails</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Sign In Form */}
      <div className="relative overflow-hidden rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-6 sm:p-8 space-y-5 border-none">
        <TopoBackdrop color="#16A34A" opacity={0.05} />
        <div className="relative z-10 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-role-teamlead rounded-[8px] text-role-teamlead text-sm font-semibold">
              {errorMessage}
            </div>
          )}

          <Input
            label="Username or email address"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="e.g. hana.tesfaye or hana@example.et"
            leftIcon={<UserIcon className="w-4 h-4 text-ink-secondary" weight="bold" />}
            autoComplete="username"
            required
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-ink-primary tracking-tight">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="font-sans text-[13px] text-ink-secondary hover:text-ink-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              leftIcon={<Key className="w-4 h-4 text-ink-secondary" weight="bold" />}
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
              autoComplete="current-password"
              required
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-5 h-5" weight="bold" />}
            >
              Sign in to account
            </Button>
          </div>

          <div className="pt-4 text-center text-sm font-sans text-ink-secondary border-t border-[#D5DAE1] flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>New volunteer?</span>
            <Link to="/register" className="font-semibold text-ink-primary hover:underline">
              Register a new account →
            </Link>
          </div>
        </form>
        </div>
      </div>

      <DemoEmailInbox
        isOpen={emailInboxOpen}
        onClose={() => setEmailInboxOpen(false)}
      />
    </div>
  );
};
