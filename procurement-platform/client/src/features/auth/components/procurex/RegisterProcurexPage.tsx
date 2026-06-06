import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '@/features/auth/api';
import { useCurrentLegalVersions } from '@/features/public/hooks';
import { apiErrorMessage } from '@/shared/api/errors';
import { useBodyPageMetadata } from '@/shared/hooks/useBodyPageMetadata';

type RegisterStep = 1 | 2 | 3 | 4 | 5;

const identityDevBypass = import.meta.env.VITE_IDENTITY_DEV_BYPASS === 'true' && !import.meta.env.PROD;
const devOtpCode = '000000';
const devActivationCode = '00000000';

function passwordChecks(password: string) {
  return {
    length: password.length >= 8 && password.length <= 64,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };
}

export function RegisterProcurexPage() {
  const navigate = useNavigate();
  useBodyPageMetadata('register');
  const [step, setStep] = useState<RegisterStep>(1);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpChallengeId, setOtpChallengeId] = useState('');
  const [activationChallengeId, setActivationChallengeId] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const legalVersions = useCurrentLegalVersions();
  const checks = useMemo(() => passwordChecks(password), [password]);
  const passwordReady = Object.values(checks).every(Boolean) && password === confirmPassword && termsAccepted;

  async function submitAccountInfo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const result = await authApi.startRegistration({ email, phone });
      setOtpChallengeId(result.challengeId);
      setStep(2);
    } catch (error) {
      setStatus(apiErrorMessage(error, 'Could not start registration.'));
    } finally {
      setLoading(false);
    }
  }

  async function submitOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const code = identityDevBypass && otp.length !== 6 ? devOtpCode : otp;
      const result = await authApi.verifyOtp({ challengeId: otpChallengeId, code });
      setActivationChallengeId(result.activationChallengeId);
      setStep(3);
    } catch (error) {
      setStatus(apiErrorMessage(error, 'Could not verify OTP.'));
    } finally {
      setLoading(false);
    }
  }

  async function submitActivation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const code = identityDevBypass && !activationCode.trim() ? devActivationCode : activationCode.trim();
      await authApi.activateEmail({ challengeId: activationChallengeId, code });
      setStep(4);
    } catch (error) {
      setStatus(apiErrorMessage(error, 'Could not activate email.'));
    } finally {
      setLoading(false);
    }
  }

  async function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!passwordReady) {
      setStatus('Complete all password requirements and confirm agreement.');
      return;
    }
    setLoading(true);
    setStatus('');
    try {
      await authApi.setPassword({
        email,
        password,
        termsAccepted: true,
        privacyAccepted: true,
        termsVersionId: legalVersions.data?.terms.id,
        privacyVersionId: legalVersions.data?.privacy.id
      });
      setStep(5);
    } catch (error) {
      setStatus(apiErrorMessage(error, 'Could not create account.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page-new">
      <header className="register-header-new">
        <div className="register-header-inner-new">
          <button className="brand-new" type="button" onClick={() => navigate('/')}>
            <span className="platform-logo">
              <img className="platform-logo-image" src="/assets/logo.svg" alt="ProcureX" />
            </span>
            <span className="brand-text-new">ProcureX</span>
          </button>
          <button className="login-link-new" type="button" onClick={() => navigate('/sign-in')}>
            Already have an account? Sign in
          </button>
        </div>
      </header>

      <div className="register-container-new">
        <div className="register-card-new">
          <div className="progress-section-new">
            <div className="progress-steps-new">
              {['Account Info', 'Verify Contact', 'Activate', 'Password'].map((label, index) => {
                const itemStep = index + 1;
                return (
                  <div className={`progress-step-new ${step === itemStep ? 'active' : ''} ${step > itemStep ? 'completed' : ''}`} data-step={itemStep} key={label}>
                    <div className="progress-circle-new">{itemStep}</div>
                    <span className="progress-label-new">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="screens-container-new">
            {step === 1 ? (
              <div className="register-screen-new active">
                <div className="screen-header-new">
                  <h2>Join Us</h2>
                  <p>Create an account</p>
                </div>
                <form className="screen-form-new" onSubmit={submitAccountInfo}>
                  <div className="form-group-new">
                    <label className="form-label-new">Email Address *</label>
                    <input className="form-input-new" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                  </div>
                  <div className="form-group-new">
                    <label className="form-label-new">Mobile Number *</label>
                    <input className="form-input-new" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required />
                  </div>
                  <button className="btn-continue-new" type="submit" disabled={loading}>
                    Continue
                  </button>
                </form>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="register-screen-new active">
                <div className="screen-header-new">
                  <h2>Verify Your Number</h2>
                  <p>Enter the 6-digit code sent to <strong>{phone}</strong></p>
                </div>
                <form className="screen-form-new" onSubmit={submitOtp}>
                  <div className="form-group-new">
                    <label className="form-label-new">Verification Code *</label>
                    <input className="form-input-new" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" required />
                  </div>
                  <button className="btn-continue-new" type="submit" disabled={loading || (!identityDevBypass && otp.length !== 6)}>
                    Verify
                  </button>
                </form>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="register-screen-new active">
                <div className="screen-header-new">
                  <div className="success-icon-new">OK</div>
                  <h2>Activate Your Email</h2>
                  <p>Enter the activation code sent to <strong>{email}</strong></p>
                </div>
                <form className="screen-form-new" onSubmit={submitActivation}>
                  <div className="form-group-new">
                    <label className="form-label-new">Activation Code *</label>
                    <input className="form-input-new" value={activationCode} onChange={(event) => setActivationCode(event.target.value)} required />
                  </div>
                  <button className="btn-continue-new" type="submit" disabled={loading}>
                    Continue to Password Setup
                  </button>
                </form>
              </div>
            ) : null}

            {step === 4 ? (
              <div className="register-screen-new active">
                <div className="screen-header-new">
                  <h2>Create Your Password</h2>
                  <p>This password is required on the sign-in screen.</p>
                </div>
                <form className="screen-form-new" onSubmit={submitPassword}>
                  <div className="form-group-new">
                    <label className="form-label-new">Password *</label>
                    <input className="form-input-new password-input-new" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                    <ul className="password-requirements-new">
                      <li className={checks.length ? 'met' : ''}>8 or more characters</li>
                      <li className={checks.uppercase ? 'met' : ''}>Uppercase letter</li>
                      <li className={checks.number ? 'met' : ''}>Number</li>
                      <li className={checks.special ? 'met' : ''}>Special character</li>
                    </ul>
                  </div>
                  <div className="form-group-new">
                    <label className="form-label-new">Confirm Password *</label>
                    <input className="form-input-new" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
                  </div>
                  <label className="confirm-action confirmed">
                    <input className="confirm-action-input" type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} />
                    <span>
                      Confirm that you accept the <Link to="/terms">Terms and Conditions</Link> and <Link to="/privacy">Privacy Policy</Link>.
                    </span>
                  </label>
                  <button className="btn-continue-new btn-create-new" type="submit" disabled={loading || !passwordReady}>
                    Create Account
                  </button>
                </form>
              </div>
            ) : null}

            {step === 5 ? (
              <div className="register-screen-new active">
                <div className="screen-header-new">
                  <div className="success-icon-new success-large">Done</div>
                  <h2>Account Created</h2>
                  <p>Your login credentials are ready. Sign in to continue with identity verification.</p>
                </div>
                <button className="btn-continue-new btn-dashboard-new" type="button" onClick={() => navigate('/sign-in')}>
                  Sign In
                </button>
              </div>
            ) : null}
            {status ? <p className="form-error-new">{status}</p> : null}
          </div>
        </div>
        <div className="auth-image-panel" aria-hidden="true">
          <dotlottie-player className="procurex-lottie auth-image-lottie" src="/assets/ProcureX.json" background="transparent" speed="1" loop autoplay />
        </div>
      </div>
    </div>
  );
}
