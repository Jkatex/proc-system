import { useEffect, useRef, useState } from 'react';
import { Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/app/store';
import { AccountMenu } from './AccountMenu';
import {
  PlatformAppsButton,
  PlatformAppsDrawer,
  resolvePlatformAppRoute,
  type PlatformAppPageKey
} from './procurex/PlatformAppsDrawer';

export function TopBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [appsOpen, setAppsOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const organizationLabel = user?.organization || (user?.accountType === 'ADMIN' ? 'Platform admin tools' : 'ProcureX account tools');

  useEffect(() => {
    function handleDocumentClick(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) setAppsOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setAppsOpen(false);
    }

    document.addEventListener('pointerdown', handleDocumentClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  function selectPlatformApp(pageKey: PlatformAppPageKey) {
    setAppsOpen(false);
    navigate(resolvePlatformAppRoute(pageKey));
  }

  return (
    <header className="px-topbar" ref={headerRef}>
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
          <Tooltip title={t('pages.launcher.title')}>
            <span>
              <PlatformAppsButton expanded={appsOpen} onClick={() => setAppsOpen((current) => !current)} />
            </span>
          </Tooltip>
          <PlatformAppsDrawer open={appsOpen} organizationLabel={organizationLabel} onSelect={selectPlatformApp} />
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
