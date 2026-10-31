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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-8">
      {/* Editorial Header */}
      <div className="space-y-2 border-b-2 border-ink-primary pb-6 text-center">
        <div className="inline-block px-3 py-1 bg-canvas-subdued text-ink-primary font-display font-black text-xs uppercase tracking-wider border-2 border-ink-primary shadow-[2px_2px_0_#111111] mb-2">
          Operations Access
        </div>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-ink-primary tracking-tight leading-tight">
          Sign In to Trail
        </h1>
        <p className="font-sans text-base text-ink-secondary max-w-lg mx-auto">
          Enter your volunteer or staff credentials to access your field initiatives, hours log, and operational consoles.
        </p>
      </div>

      {/* Collapsible Demo Evaluator Accounts Panel */}
      <div className="bg-white border-2 border-ink-primary shadow-[6px_6px_0_#111111] overflow-hidden">
        <button
          type="button"
          onClick={() => setDemoPanelOpen(!demoPanelOpen)}
          className="w-full px-5 py-3.5 bg-canvas-subdued border-b-2 border-ink-primary flex items-center justify-between font-display text-lg font-black text-ink-primary hover:bg-canvas-inset transition-colors cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <Sparkle className="w-5 h-5 text-role-applicant" weight="fill" />
            <span>Demo Accounts • One-Click Fill</span>
            <span className="font-sans text-xs font-bold px-2 py-0.5 bg-ink-primary text-white ml-2 border border-ink-primary">
              Password: Demo@1234
            </span>
          </div>
          {demoPanelOpen ? <CaretUp className="w-5 h-5" weight="bold" /> : <CaretDown className="w-5 h-5" weight="bold" />}
        </button>

        {demoPanelOpen && (
          <div className="p-4 bg-white space-y-2 divide-y-2 divide-canvas-subdued">
            {DEMO_PERSONAS.map((p) => (
              <button
                key={p.username}
                type="button"
                onClick={() => handleSelectDemoAccount(p.username)}
                className={`w-full pt-3 pb-2 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 hover:bg-canvas-subdued transition-colors cursor-pointer border-2 border-transparent hover:border-ink-primary ${
                  identifier === p.username ? 'bg-canvas-subdued border-ink-primary font-bold shadow-[2px_2px_0_#111111]' : ''
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-sans font-bold px-2 py-0.5 border border-ink-primary ${p.color}`}>
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
                <div className="font-sans text-xs font-bold text-ink-secondary bg-canvas-inset px-2 py-1 border border-ink-primary/30">
                  {p.username}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Sign In Form */}
      <div
        className="bg-white border-2 border-ink-primary p-6 sm:p-8 shadow-[6px_6px_0_#111111] space-y-6"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage && (
            <div className="p-4 bg-red-50 border-2 border-role-teamlead text-role-teamlead text-sm font-sans font-bold">
              {errorMessage}
            </div>
          )}

          <div className="space-y-1.5">
            <Input
              label="Username or Email Address"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. hana.tesfaye or hana@example.et"
              leftIcon={<UserIcon className="w-4 h-4 text-ink-secondary" weight="bold" />}
              autoComplete="username"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-ink-primary tracking-tight">
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

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-5 h-5" weight="bold" />}
          >
            Sign In to Trail
          </Button>

          <div className="pt-4 text-center text-sm font-sans text-ink-secondary border-t-2 border-dashed border-ink-primary flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>New volunteer?</span>
            <Link to="/register" className="font-bold text-ink-primary hover:underline border-b-2 border-ink-primary">
              Register a new account →
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
