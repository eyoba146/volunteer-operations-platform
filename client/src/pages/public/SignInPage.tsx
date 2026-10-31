import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input, Button } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { Key, User as UserIcon, Eye, EyeSlash, ArrowRight, CaretDown, CaretUp, Sparkle } from '@phosphor-icons/react';

const DEMO_PERSONAS = [
  {
    role: 'Applicant',
    name: 'Hana Tesfaye',
    username: 'hana.tesfaye',
    stage: 'Accepted • Ready to pay Telebirr fee',
    color: 'bg-role-applicant text-ink-primary',
  },
  {
    role: 'Volunteer (Member)',
    name: 'Dawit Bekele',
    username: 'dawit.bekele',
    stage: 'Active Member • Enrolled in today cleanup',
    color: 'bg-role-volunteer text-white',
  },
  {
    role: 'Volunteer (Senior)',
    name: 'Selam Alemu',
    username: 'selam.alemu',
    stage: '168 hrs completed • Promotion pending',
    color: 'bg-amber-600 text-white',
  },
  {
    role: 'Team Lead',
    name: 'Yonas Kebede',
    username: 'yonas.kebede',
    stage: 'Field Coordinator • Approves hours & rates work',
    color: 'bg-role-teamlead text-white',
  },
  {
    role: 'Manager',
    name: 'Marta Girma',
    username: 'marta.girma',
    stage: 'Operations • Reviews applicants & promotions',
    color: 'bg-role-manager text-white',
  },
  {
    role: 'Finance Officer',
    name: 'Abel Hailu',
    username: 'abel.hailu',
    stage: 'Telebirr Audit • 2 flagged payments to review',
    color: 'bg-role-finance text-role-financeAccent',
  },
  {
    role: 'Super Admin',
    name: 'Ruth Mengistu',
    username: 'ruth.mengistu',
    stage: 'Director • Calibrates fees & rank rules',
    color: 'bg-role-admin text-white',
  },
];

export const SignInPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [identifier, setIdentifier] = useState(searchParams.get('account') || '');
  const [password, setPassword] = useState('Demo@1234');
  const [showPassword, setShowPassword] = useState(false);
  const [demoPanelOpen, setDemoPanelOpen] = useState(true);
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
      redirectToRoleWorkspace(user.role);
    }
  }, [user]);

  const redirectToRoleWorkspace = (role: string) => {
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
      redirectToRoleWorkspace(loggedIn.role);
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-8">
      {/* Editorial Header */}
      <div className="space-y-2 border-b-2 border-ink-primary pb-6 text-center">
        <h1 className="font-display font-black text-5xl sm:text-6xl uppercase tracking-tight text-ink-primary leading-none">
          Sign In to VTS
        </h1>
        <p className="font-sans text-sm sm:text-base text-ink-secondary">
          Enter your credentials to access your volunteer trail and field assignments.
        </p>
      </div>

      {/* Collapsible Demo Evaluator Accounts Panel */}
      <div className="bg-white border-2 border-ink-primary shadow-ticket overflow-hidden">
        <button
          type="button"
          onClick={() => setDemoPanelOpen(!demoPanelOpen)}
          className="w-full px-5 py-3.5 bg-canvas-subdued border-b-2 border-ink-primary flex items-center justify-between font-display text-lg font-black uppercase text-ink-primary hover:bg-canvas-inset transition-colors cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-role-applicant" />
            <span>Demo Accounts • Quick Select</span>
            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-ink-primary text-white ml-2">
              Password: Demo@1234
            </span>
          </div>
          {demoPanelOpen ? <CaretUp className="w-5 h-5" weight="bold" /> : <CaretDown className="w-5 h-5" weight="bold" />}
        </button>

        {demoPanelOpen && (
          <div className="p-4 bg-white space-y-2 divide-y divide-border">
            {DEMO_PERSONAS.map((p) => (
              <button
                key={p.username}
                type="button"
                onClick={() => handleSelectDemoAccount(p.username)}
                className={`w-full pt-2.5 pb-2 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 hover:bg-canvas-subdued transition-colors cursor-pointer ${
                  identifier === p.username ? 'bg-canvas-subdued font-bold' : ''
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-sans font-bold px-1.5 py-0.5 uppercase ${p.color}`}>
                      {p.role}
                    </span>
                    <span className="font-sans text-sm font-bold text-ink-primary">
                      {p.name}
                    </span>
                  </div>
                  <span className="font-sans text-xs text-ink-secondary block">
                    {p.stage}
                  </span>
                </div>
                <div className="font-mono text-xs font-bold text-ink-tertiary">
                  {p.username}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Sign In Form */}
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
              Username or Email Address
            </label>
            <Input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. hana.tesfaye or volunteer@example.com"
              leftIcon={<UserIcon className="w-4 h-4 text-ink-secondary" />}
              autoComplete="username"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block font-sans text-xs font-bold uppercase tracking-tight text-ink-primary">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="font-sans text-xs font-bold text-ink-secondary hover:text-ink-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              leftIcon={<Key className="w-4 h-4 text-ink-secondary" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-ink-tertiary hover:text-ink-primary cursor-pointer"
                >
                  {showPassword ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              autoComplete="current-password"
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full text-base font-bold"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" weight="bold" />}
          >
            Sign In to Trail
          </Button>

          <div className="pt-2 text-center text-xs font-sans text-ink-secondary border-t border-border">
            Do not have an account yet?{' '}
            <Link to="/register" className="font-bold text-ink-primary underline underline-offset-2">
              Join as a volunteer
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
