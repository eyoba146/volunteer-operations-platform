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
    dotColor: 'bg-role-applicant',
  },
  {
    role: 'Volunteer (Member)',
    name: 'Dawit Bekele',
    username: 'dawit.bekele',
    stage: 'Active Member • Enrolled in today cleanup',
    dotColor: 'bg-role-volunteer',
  },
  {
    role: 'Volunteer (Senior)',
    name: 'Selam Alemu',
    username: 'selam.alemu',
    stage: '168 hrs completed • Promotion pending',
    dotColor: 'bg-amber-500',
  },
  {
    role: 'Team Lead',
    name: 'Yonas Kebede',
    username: 'yonas.kebede',
    stage: 'Field Coordinator • Approves hours & rates work',
    dotColor: 'bg-role-teamlead',
  },
  {
    role: 'Manager',
    name: 'Marta Girma',
    username: 'marta.girma',
    stage: 'Operations • Reviews applicants & promotions',
    dotColor: 'bg-role-manager',
  },
  {
    role: 'Finance Officer',
    name: 'Abel Hailu',
    username: 'abel.hailu',
    stage: 'Telebirr Audit • Flagged payments to review',
    dotColor: 'bg-slate-900',
  },
  {
    role: 'Super Admin',
    name: 'Ruth Mengistu',
    username: 'ruth.mengistu',
    stage: 'Director • Calibrates fees & rank rules',
    dotColor: 'bg-slate-700',
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
      setErrorMessage('Please enter your username or email.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const loggedIn = await signIn(identifier.trim(), password);
      toast.success(`Welcome back, ${loggedIn.username}!`);
      redirectToRoleWorkspace(loggedIn.role);
    } catch (err: any) {
      setErrorMessage(err.message || 'Incorrect credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDemoAccount = (un: string) => {
    setIdentifier(un);
    setPassword('Demo@1234');
    setErrorMessage('');
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center pb-2">
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight text-slate-900 leading-none">
          Sign In
        </h1>
        <p className="font-sans text-sm text-slate-500 max-w-sm mx-auto">
          Access your volunteer profile, logged hours, and field assignments.
        </p>
      </div>

      {/* Quick Select Demo Accounts Panel */}
      <div className="bg-white rounded-[24px] shadow-soft border border-slate-100 overflow-hidden">
        <button
          type="button"
          onClick={() => setDemoPanelOpen(!demoPanelOpen)}
          className="w-full px-5 py-3.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between font-sans text-xs font-semibold text-slate-700 hover:bg-slate-100/60 transition-colors cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand" />
            <span>Demo Accounts • Quick Select</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-500 ml-1">
              Password: Demo@1234
            </span>
          </div>
          {demoPanelOpen ? <CaretUp className="w-4 h-4 text-slate-500" /> : <CaretDown className="w-4 h-4 text-slate-500" />}
        </button>

        {demoPanelOpen && (
          <div className="p-3 bg-white space-y-1 max-h-72 overflow-y-auto divide-y divide-slate-100">
            {DEMO_PERSONAS.map((p) => (
              <button
                key={p.username}
                type="button"
                onClick={() => handleSelectDemoAccount(p.username)}
                className={`w-full text-left flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 p-3 rounded-[14px] hover:bg-slate-50 transition-colors cursor-pointer ${
                  identifier === p.username ? 'bg-slate-50 font-semibold' : ''
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${p.dotColor}`} />
                    <span className="font-sans text-xs font-semibold text-slate-800">
                      {p.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {p.role}
                    </span>
                  </div>
                  <span className="font-sans text-xs text-slate-500 block pl-4">
                    {p.stage}
                  </span>
                </div>
                <div className="font-mono text-xs text-slate-400 pl-4 sm:pl-0">
                  {p.username}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Sign In Form */}
      <div className="bg-white rounded-[24px] shadow-soft border border-slate-100 p-6 sm:p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-[14px] text-rose-700 text-xs font-sans">
              {errorMessage}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block font-sans text-xs font-semibold text-slate-700">
              Username or Email
            </label>
            <Input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. hana.tesfaye or volunteer@example.com"
              leftIcon={<UserIcon className="w-4 h-4 text-slate-400" />}
              autoComplete="username"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block font-sans text-xs font-semibold text-slate-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="font-sans text-xs font-medium text-brand hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                leftIcon={<Key className="w-4 h-4 text-slate-400" />}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
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
              Sign In
            </Button>
          </div>
        </form>

        <div className="text-center pt-4 border-t border-slate-100 text-xs text-slate-500 font-sans">
          Do not have an account yet?{' '}
          <Link to="/register" className="font-semibold text-brand hover:underline">
            Join as Volunteer
          </Link>
        </div>
      </div>
    </div>
  );
};
