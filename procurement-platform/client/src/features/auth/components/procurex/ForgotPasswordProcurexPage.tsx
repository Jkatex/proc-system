import { FormEvent, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '@/features/auth/api';
import { apiErrorMessage } from '@/shared/api/errors';
import { useBodyPageMetadata } from '@/shared/hooks/useBodyPageMetadata';

type ResetStep = 'request' | 'reset' | 'complete';

function passwordChecks(password: string) {
  return {
    length: password.length >= 8 && password.length <= 64,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };
}

export function ForgotPasswordProcurexPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialChallengeId = searchParams.get('challengeId') ?? '';
  const initialCode = searchParams.get('code') ?? '';
  const [step, setStep] = useState<ResetStep>(initialChallengeId ? 'reset' : 'request');
  const [email, setEmail] = useState('');
  const [challengeId, setChallengeId] = useState(initialChallengeId);
  const [code, setCode] = useState(initialCode);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const checks = useMemo(() => passwordChecks(password), [password]);
  const passwordReady = Object.values(checks).every(Boolean) && password === confirmPassword;

  useBodyPageMetadata('forgot-password');

  async function requestReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await authApi.forgotPassword({ email });
      setMessage(response.message);
      if (response.challengeId) {
        setChallengeId(response.challengeId);
        setStep('reset');
      }
    } catch (error) {
      setMessage(apiErrorMessage(error, 'Could not request password reset.'));
    } finally {
      setLoading(false);
    }
  }

  async function submitReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!challengeId || !code.trim()) {
      setMessage('Open the reset link from your email or enter the reset code provided to you.');
      return;
    }
    if (!passwordReady) {
      setMessage('Complete all password requirements and confirm both passwords match.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await authApi.resetPassword({ challengeId, code: code.trim(), password });
      setStep('complete');
      setMessage('Your password has been updated.');
    } catch (error) {
      setMessage(apiErrorMessage(error, 'Could not reset password.'));
    } finally {
      setLoading(false);
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
          <button className="login-link-new" type="button" onClick={() => navigate('/sign-in')}>
            Back to sign in
          </button>
        </div>
      </header>

      <div className="register-container-new">
        <div className="register-card-new auth-card">
          <div className="screens-container-new">
            {step === 'request' ? (
              <div className="register-screen-new active">
                <div className="screen-header-new">
                  <h2>Reset Password</h2>
                  <p>Enter your account email to receive reset instructions.</p>
                </div>
                <form className="screen-form-new" onSubmit={(event) => void requestReset(event)}>
                  <div className="form-group-new">
                    <label className="form-label-new">Email Address *</label>
                    <input className="form-input-new" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                  </div>
                  <button className="btn-continue-new" type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Instructions'}
                  </button>
                </form>
              </div>
            ) : null}

            {step === 'reset' ? (
              <div className="register-screen-new active">
                <div className="screen-header-new">
                  <h2>Create New Password</h2>
                  <p>Enter the reset code from your email and choose a new password.</p>
                </div>
                <form className="screen-form-new" onSubmit={(event) => void submitReset(event)}>
                  <div className="form-group-new">
                    <label className="form-label-new">Reset Code *</label>
                    <input className="form-input-new" value={code} onChange={(event) => setCode(event.target.value)} required />
                  </div>
                  <div className="form-group-new">
                    <label className="form-label-new">New Password *</label>
                    <input className="form-input-new password-input-new" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                    <ul className="password-requirements-new">
                      <li className={checks.length ? 'met' : ''}>8 or more characters</li>
                      <li className={checks.uppercase ? 'met' : ''}>Uppercase letter</li>
                      <li className={checks.number ? 'met' : ''}>Number</li>
                      <li className={checks.special ? 'met' : ''}>Special character</li>
                    </ul>
                  </div>
                  <div className="form-group-new">
                    <label className="form-label-new">Confirm New Password *</label>
                    <input className="form-input-new" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
                  </div>
                  <button className="btn-continue-new" type="submit" disabled={loading || !passwordReady}>
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            ) : null}

            {step === 'complete' ? (
              <div className="register-screen-new active">
                <div className="screen-header-new">
                  <div className="success-icon-new success-large">Done</div>
                  <h2>Password Updated</h2>
                  <p>You can now sign in with your new password.</p>
                </div>
                <button className="btn-continue-new btn-dashboard-new" type="button" onClick={() => navigate('/sign-in')}>
                  Sign In
                </button>
              </div>
            ) : null}

            {message ? <p className="form-error-new">{message}</p> : null}
          </div>
        </div>
        <div className="auth-image-panel" aria-hidden="true">
          <dotlottie-player className="procurex-lottie auth-image-lottie" src="/assets/ProcureX.json" background="transparent" speed="1" loop autoplay />
        </div>
      </div>
    </div>
  );
}
