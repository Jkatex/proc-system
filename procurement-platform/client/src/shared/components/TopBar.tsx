import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Button, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { signOut } from '@/features/auth/slice';
import { LanguageSwitcher } from './LanguageSwitcher';

export function TopBar() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <header className="px-topbar">
      <div className="px-topbar-inner">
        <Link className="px-brand" to={user?.accountType === 'ADMIN' ? '/admin' : '/dashboard'}>
          <img src="/assets/logo.svg" alt="" />
          <span>{t('brand')}</span>
        </Link>
        <nav className="px-nav-links" aria-label="Primary">
          <NavLink to="/dashboard">{t('nav.dashboard')}</NavLink>
          <NavLink to="/procurement/marketplace">{t('nav.marketplace')}</NavLink>
          <NavLink to="/communication">{t('nav.communication')}</NavLink>
          {user?.accountType === 'ADMIN' ? <NavLink to="/admin">{t('nav.admin')}</NavLink> : null}
        </nav>
        <div className="px-actions" style={{ marginTop: 0 }}>
          <LanguageSwitcher />
          <Tooltip title={t('pages.launcher.title')}>
            <IconButton component={Link} to="/apps" aria-label={t('pages.launcher.title')}>
              <AppsRoundedIcon />
            </IconButton>
          </Tooltip>
          <Button
            startIcon={<LogoutRoundedIcon />}
            variant="outlined"
            onClick={() => dispatch(signOut())}
            component={Link}
            to="/sign-in"
          >
            {t('actions.logout')}
          </Button>
        </div>
      </div>
    </header>
  );
}
