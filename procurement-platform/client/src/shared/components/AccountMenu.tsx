import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MarkEmailUnreadRoundedIcon from '@mui/icons-material/MarkEmailUnreadRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import {
  Avatar,
  Badge,
  Box,
  Divider,
  FormControl,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  Tooltip,
  Typography,
  type SelectChangeEvent
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { accountApi, type AccountActivityEvent } from '@/features/account/api';
import { signOut, signOutSession, hydrateAuthSession } from '@/features/auth/slice';
import { communicationApi } from '@/features/communication/api';
import i18n, { persistLanguage, supportedLanguages, type SupportedLanguage } from '@/i18n';

type AccountMenuProps = {
  buttonClassName?: string;
};

const languageLabels: Record<SupportedLanguage, string> = {
  en: 'English',
  sw: 'Kiswahili'
};

export function AccountMenu({ buttonClassName }: AccountMenuProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const open = Boolean(anchorEl);
  const language = normalizeLanguage(user?.preferences?.preferredLanguage ?? i18n.language);

  useEffect(() => {
    if (!open || !user?.organizationId) return;
    let mounted = true;
    communicationApi
      .listMailbox({ organizationId: user.organizationId, folder: 'unread', page: 1, pageSize: 1 })
      .then((mailbox) => {
        if (mounted) setUnreadCount(mailbox.counts.unread);
      })
      .catch(() => {
        if (mounted) setUnreadCount(0);
      });
    return () => {
      mounted = false;
    };
  }, [open, user?.organizationId]);

  if (!user) return null;

  function closeMenu() {
    setAnchorEl(null);
  }

  function recordActivity(event: AccountActivityEvent) {
    void accountApi.recordActivity(event).catch(() => undefined);
  }

  function navigateFromMenu(route: string, event: AccountActivityEvent) {
    closeMenu();
    recordActivity(event);
    navigate(route);
  }

  async function changeLanguage(event: SelectChangeEvent) {
    const nextLanguage = normalizeLanguage(event.target.value);
    persistLanguage(nextLanguage);
    await i18n.changeLanguage(nextLanguage);
    try {
      await accountApi.updatePreferences({ preferredLanguage: nextLanguage });
      void dispatch(hydrateAuthSession());
    } catch {
      // localStorage remains the fallback if the session is offline or expired.
    }
  }

  function logout() {
    closeMenu();
    dispatch(signOutSession())
      .unwrap()
      .catch(() => {
        dispatch(signOut());
      })
      .finally(() => {
        navigate('/sign-in');
      });
  }

  const badgeLabel = user.accountType === 'ADMIN' ? 'Admin' : user.verificationStatus === 'APPROVED' ? 'Verified' : 'Account';

  return (
    <>
      <Tooltip title="Account menu">
        <IconButton
          className={buttonClassName}
          type="button"
          aria-label="Open account menu"
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="menu"
          aria-expanded={open ? 'true' : 'false'}
          onClick={(event) => setAnchorEl(event.currentTarget)}
          size="small"
        >
          <Badge badgeContent={unreadCount || null} color="error" overlap="circular">
            <Avatar sx={{ width: 34, height: 34, fontSize: 13, bgcolor: '#244236' }}>{initials(user.displayName)}</Avatar>
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
        MenuListProps={{ 'aria-label': 'Account menu' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <Box sx={{ px: 2, py: 1.5, minWidth: 280 }}>
          <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center' }}>
            <Avatar sx={{ width: 40, height: 40, fontSize: 14, bgcolor: '#244236' }}>{initials(user.displayName)}</Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap>
                {user.displayName}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {user.organization || 'ProcureX account'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 1, color: 'success.main' }}>
            <VerifiedUserRoundedIcon fontSize="small" />
            <Typography variant="caption">{badgeLabel}</Typography>
          </Box>
        </Box>
        <Divider />
        <MenuItem onClick={() => navigateFromMenu('/identity/profile', 'identity.profile.opened')}>
          <ListItemIcon>
            <AccountCircleRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => navigateFromMenu('/communication', 'communication.messages.opened')}>
          <ListItemIcon>
            <MarkEmailUnreadRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Messages</ListItemText>
          {unreadCount ? <Typography variant="caption">{unreadCount}</Typography> : null}
        </MenuItem>
        <MenuItem onClick={() => navigateFromMenu('/help', 'support.help.opened')}>
          <ListItemIcon>
            <HelpOutlineRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Help</ListItemText>
        </MenuItem>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1 }} onClick={(event) => event.stopPropagation()}>
          <LanguageRoundedIcon fontSize="small" />
          <FormControl size="small" fullWidth>
            <Select value={language} onChange={changeLanguage} aria-label="Language" inputProps={{ 'data-testid': 'account-language-select' }}>
              {supportedLanguages.map((item) => (
                <MenuItem key={item} value={item}>
                  {languageLabels[item]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Divider />
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

function initials(name?: string | null) {
  const parts = String(name || 'ProcureX user')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return `${parts[0]?.[0] || 'P'}${parts.length > 1 ? parts[1]?.[0] || '' : ''}`.toUpperCase();
}

function normalizeLanguage(value: string): SupportedLanguage {
  return supportedLanguages.includes(value as SupportedLanguage) ? (value as SupportedLanguage) : 'en';
}
