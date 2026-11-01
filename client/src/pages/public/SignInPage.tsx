import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageShell, Input, Button, TopoBackdrop, Panel, Raised } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { Key, User as UserIcon, Eye, EyeSlash, ArrowRight, CaretDown, CaretUp, Sparkle, Envelope } from '@phosphor-icons/react';
import { DemoEmailInbox } from '../../components/demo/DemoEmailInbox';

const DEMO_PERSONAS = [
  {
    role: 'Applicant',
    name: 'Hana Tesfaye',
    username: 'hana.tesfaye',
    stage: 'Application accepted, payment pending',
    color: '#D97706',
    badgeClass: 'bg-amber-100 text-amber-900',
  },
  {
    role: 'Volunteer (Member)',
    name: 'Dawit Bekele',
    username: 'dawit.bekele',
    stage: '48.5 hours logged, 8 activities completed',
    color: '#16A34A',
    badgeClass: 'bg-emerald-100 text-emerald-900',
  },
  {
    role: 'Volunteer (Senior Member)',
    name: 'Selam Alemu',
    username: 'selam.alemu',
    stage: '162 hours logged, promotion eligible',
    color: '#16A34A',
    badgeClass: 'bg-emerald-100 text-emerald-900',
  },
  {
    role: 'Team Lead',
    name: 'Yonas Kebede',
    username: 'yonas.kebede',
    stage: '5 activities led, 3 check-ins pending',
    color: '#DC2626',
    badgeClass: 'bg-rose-100 text-rose-900',
  },
  {
    role: 'Manager',
    name: 'Marta Girma',
    username: 'marta.girma',
    stage: '14 applications pending review',
    color: '#0D9488',
    badgeClass: 'bg-teal-100 text-teal-900',
  },
  {
    role: 'Finance Officer',
    name: 'Abel Hailu',
    username: 'abel.hailu',
    stage: '2 payments needing review',
    color: '#6366F1',
    badgeClass: 'bg-indigo-100 text-indigo-900',
  },
  {
    role: 'Super Admin',
    name: 'Ruth Mengistu',
    username: 'ruth.mengistu',
    stage: 'Full platform configuration',
    color: '#475569',
    badgeClass: 'bg-slate-200 text-slate-800',
  },
];

export const SignInPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [demoPanelOpen, setDemoPanelOpen] = useState(false);
  const [emailInboxOpen, setEmailInboxOpen] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const verifiedParam = searchParams.get('verified');
    if (verifiedParam === 'true') {
      toast.success('Email verified successfully! You can now sign in.');
    }
  }, [searchParams, toast]);

  const redirectToRoleHome = (role: string) => {
    const from = (location.state as any)?.from?.pathname;
    if (from && from !== '/sign-in') {
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
    <PageShell page="public/sign-in" signature="TopoBackdrop">
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
        <Panel padding="none" className="overflow-hidden">
          <button
            type="button"
            onClick={() => setDemoPanelOpen(!demoPanelOpen)}
            className="w-full px-5 py-3.5 bg-[#F1F3F6] border-b border-[#EDEFF2] flex items-center justify-between font-display text-base font-bold text-ink-primary hover:bg-[#E8EBEF] transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <Sparkle className="w-4 h-4 text-role-applicant" weight="fill" />
              <span>Demo evaluator accounts</span>
              <span className="font-sans text-[13px] px-2 py-0.5 bg-white text-ink-secondary rounded-[4px] ml-1">
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
                  className={`w-full pt-2.5 pb-2 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-[8px] hover:bg-[#F7F8FA] transition-colors cursor-pointer ${
                    identifier === p.username ? 'bg-[#F7F8FA] font-semibold' : ''
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
                  <div className="font-sans text-[13px] text-ink-secondary bg-[#F1F3F6] px-2 py-1 rounded-[4px]">
                    {p.username}
                  </div>
                </button>
              ))}

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setEmailInboxOpen(true)}
                  className="text-[13px] font-semibold text-ink-secondary hover:text-ink-primary flex items-center gap-1.5 py-1.5 px-3 rounded-[6px] bg-[#F1F3F6] hover:bg-[#E8EBEF] cursor-pointer"
                >
                  <Envelope className="w-3.5 h-3.5 text-role-applicant" weight="bold" />
                  <span>Preview transactional emails</span>
                </button>
              </div>
            </div>
          )}
        </Panel>

        {/* Main Sign In Form */}
        <Raised className="relative overflow-hidden p-6 sm:p-8 space-y-5">
          <TopoBackdrop color="#16A34A" opacity={0.06} />
          <div className="relative z-10 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 bg-rose-50 rounded-[8px] text-rose-700 text-sm font-semibold">
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

              <div className="pt-4 text-center text-sm font-sans text-ink-secondary border-t border-[#EDEFF2] flex flex-col sm:flex-row items-center justify-between gap-2">
                <span>New volunteer?</span>
                <Link to="/register" className="font-semibold text-ink-primary hover:underline">
                  Register a new account →
                </Link>
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
