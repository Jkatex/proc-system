import { Button, Card, CardContent, TextField } from '@mui/material';
import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/app/store';
import { PageHeader } from '@/shared/components';
import { signInWithCredentials } from '../slice';

export function SignInPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    try {
      const session = await dispatch(signInWithCredentials({ email, password })).unwrap();
      navigate(session.user.accountType === 'ADMIN' ? '/admin' : session.user.verificationStatus === 'APPROVED' ? '/dashboard' : '/identity/verification');
    } catch {
      setError('Sign-in failed. Check the email and password.');
    }
  }

  return (
    <section className="px-section">
      <PageHeader title={t('pages.signIn.title')} subtitle={t('pages.signIn.subtitle')} />
      <Card className="px-card">
        <CardContent>
          <form className="px-form-grid" onSubmit={(event) => void submit(event)}>
            <TextField label="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <TextField label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            {error ? <p className="form-error-new">{error}</p> : null}
            <Button type="submit" variant="contained">
              {t('actions.signIn')}
            </Button>
            <Button component={Link} to="/register" variant="outlined">
              {t('actions.register')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

export function RegisterPage() {
  const { t } = useTranslation();
  return (
    <section className="px-section">
      <PageHeader title={t('pages.register.title')} subtitle={t('pages.register.subtitle')} />
      <div className="px-grid two">
        <Card className="px-card">
          <CardContent>
            <div className="px-form-grid">
              <TextField label="Company name" placeholder="Enter company name" />
              <TextField label="Email" placeholder="Enter email address" />
              <TextField label="Phone" placeholder="Enter phone number" />
              <TextField label="Password" type="password" placeholder="Create password" />
            </div>
            <div className="px-actions">
              <Button component={Link} to="/identity/verification" variant="contained">
                {t('actions.continue')}
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="px-hero-media">
          <img src="/assets/welcome/opportunity-signing.webp" alt="" />
        </div>
      </div>
    </section>
  );
}

export function RoleSelectionPage() {
  const { t } = useTranslation();
  return (
    <section className="px-section">
      <PageHeader title={t('pages.roleSelection.title')} subtitle={t('pages.roleSelection.subtitle')} />
      <div className="px-grid two">
        <article className="px-card">
          <h3>User account</h3>
          <p>One verified organization can enable buyer and supplier capability.</p>
          <Button component={Link} to="/register" variant="contained">
            {t('actions.continue')}
          </Button>
        </article>
        <article className="px-card">
          <h3>Platform admin</h3>
          <p>Admin access is separate and reserved for compliance operations.</p>
          <Button component={Link} to="/sign-in" variant="outlined">
            {t('actions.signIn')}
          </Button>
        </article>
      </div>
    </section>
  );
}
