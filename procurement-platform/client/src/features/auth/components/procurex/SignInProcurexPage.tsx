import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { signInWithCredentials } from '@/features/auth/slice';
import { apiErrorMessage } from '@/shared/api/errors';
import { useBodyPageMetadata } from '@/shared/hooks/useBodyPageMetadata';

type LocationState = {
  from?: {
    pathname?: string;
  };
};

function destinationFor(user: { accountType: string; verificationStatus: string }, intendedPath?: string) {
  if (user.accountType === 'ADMIN') return '/admin';
  if (user.verificationStatus !== 'APPROVED') return '/identity/verification';
  return intendedPath && intendedPath !== '/sign-in' ? intendedPath : '/apps';
}

export function SignInProcurexPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authStatus = useAppSelector((state) => state.auth.status);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const loading = authStatus === 'loading';
  const locationState = location.state as LocationState | null;

  useBodyPageMetadata('sign-in');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    try {
      const session = await dispatch(signInWithCredentials({ email, password })).unwrap();
      const intendedPath = locationState?.from?.pathname;
      navigate(destinationFor(session.user, intendedPath), { replace: true });
    } catch (caughtError) {
      setError(apiErrorMessage(caughtError, 'Sign-in failed. Check the email and password.'));
    }
  }

  return (
    <div className="register-page-new auth-page">
      <header className="register-header-new">
        <div className="register-header-inner-new">
          <button className="brand-new" type="button" onClick={() => navigate('/')}>
            <span className="platform-logo">
              <img className="platform-logo-image" src="/assets/logo.svg" alt="ProcureX" />
            </span>
            <span className="brand-text-new">ProcureX</span>
          </button>
          <button className="login-link-new" type="button" onClick={() => navigate('/register')}>
            Create an account
          </button>
        </div>
      </header>

      <div className="register-container-new">
        <div className="register-card-new auth-card">
          <div className="screens-container-new">
            <div className="screen-header-new">
              <h2>Welcome Back</h2>
              <p>Sign in</p>
            </div>

            <form className="screen-form-new" onSubmit={(event) => void submit(event)}>
              <div className="form-group-new">
                <label className="form-label-new">Email Address *</label>
                <input
                  className="form-input-new"
                  type="email"
                  value={email}
                  placeholder="you@company.com"
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="form-group-new">
                <label className="form-label-new">Password *</label>
                <div className="password-input-wrapper-new">
                  <input
                    className="form-input-new"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    placeholder="Enter your password"
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-new"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="auth-row">
                <label className="auth-check">
                  <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
                  <span>Remember me</span>
                </label>
                <button className="link-new" type="button" onClick={() => navigate('/forgot-password')}>
                  Forgot password?
                </button>
              </div>

              {error ? <p className="form-error-new">{error}</p> : null}

              <button type="submit" className="btn-continue-new" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="auth-note">
              Your account opens the workspace allowed by its verification status.
            </div>
          </div>
        </div>
        <div className="auth-image-panel" aria-hidden="true">
          <dotlottie-player className="procurex-lottie auth-image-lottie" src="/assets/ProcureX.json" background="transparent" speed="1" loop autoplay />
        </div>
      </div>
    </div>
  );
}
