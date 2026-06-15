import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { signOut } from '@/features/auth/slice';
import {
  PlatformAppsButton,
  PlatformAppsDrawer,
  type PlatformAppPageKey
} from '@/shared/components/procurex/PlatformAppsDrawer';

type PlanningTopBarProps = {
  title?: string;
  onNavigate: (pageKey: string) => void;
};

function initials(name?: string | null) {
  const parts = String(name || 'ProcureX user')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return (parts[0]?.[0] || 'P').toUpperCase() + (parts.length > 1 ? (parts[1]?.[0] || '').toUpperCase() : '');
}

export function PlanningTopBar({ title = 'Procurement Planning', onNavigate }: PlanningTopBarProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [openMenu, setOpenMenu] = useState<'apps' | 'profile' | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const organizationLabel = user?.organization || (user?.accountType === 'ADMIN' ? 'Platform admin tools' : 'ProcureX account tools');

  useEffect(() => {
    function handleDocumentClick(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) setOpenMenu(null);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpenMenu(null);
    }

    document.addEventListener('pointerdown', handleDocumentClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  function navigate(pageKey: string) {
    setOpenMenu(null);
    onNavigate(pageKey);
  }

  function navigatePlatformApp(pageKey: PlatformAppPageKey) {
    navigate(pageKey);
  }

  function logout() {
    setOpenMenu(null);
    dispatch(signOut());
    onNavigate('sign-in');
  }

  return (
    <header className="app-topbar" ref={headerRef}>
      <div className="app-topbar-left">
        <button
          className="app-brand-button"
          type="button"
          data-navigate="workspace-dashboard"
          onClick={() => navigate('workspace-dashboard')}
        >
          <span className="platform-logo">
            <img className="platform-logo-image" src="/assets/logo.svg" alt="ProcureX" />
          </span>
          <span>{title}</span>
        </button>
      </div>

      <div className="app-topbar-actions">
        <PlatformAppsButton
          expanded={openMenu === 'apps'}
          onClick={() => setOpenMenu((current) => (current === 'apps' ? null : 'apps'))}
        />
        <div className="profile-menu-wrap">
          <button
            className="profile-button"
            type="button"
            data-profile-menu-toggle
            aria-label="Open profile menu"
            aria-expanded={openMenu === 'profile'}
          onClick={() => setOpenMenu((current) => (current === 'profile' ? null : 'profile'))}
          >
            <span>{initials(user?.displayName)}</span>
          </button>
        </div>
      </div>

      <PlatformAppsDrawer open={openMenu === 'apps'} organizationLabel={organizationLabel} onSelect={navigatePlatformApp} />

      <div className={`profile-menu${openMenu === 'profile' ? ' open' : ''}`} data-profile-menu>
        <button type="button" data-navigate="account-profile" onClick={() => navigate('account-profile')}>
          Profile
        </button>
        <button type="button" data-navigate="communication-center" onClick={() => navigate('communication-center')}>
          Messages
        </button>
        <button type="button">Help</button>
        <button type="button">Language</button>
        <button type="button" data-navigate="sign-in" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}
