import { MenuItem, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { store } from '@/app/store';
import { accountApi } from '@/features/account/api';
import { hydrateAuthSession } from '@/features/auth/slice';
import { persistLanguage, type SupportedLanguage } from '@/i18n';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const language = i18n.language === 'sw' ? 'sw' : 'en';

  async function handleChange(nextLanguage: SupportedLanguage) {
    await i18n.changeLanguage(nextLanguage);
    persistLanguage(nextLanguage);
    if (!store.getState().auth.isAuthenticated) return;
    try {
      await accountApi.updatePreferences({ preferredLanguage: nextLanguage });
      void store.dispatch(hydrateAuthSession());
    } catch {
      // Local storage remains the fallback when the session cannot be refreshed.
    }
  }

  return (
    <Select
      aria-label={t('language')}
      inputProps={{ 'aria-label': t('language') }}
      SelectDisplayProps={{ 'aria-label': t('language') }}
      value={language}
      size="small"
      onChange={(event) => void handleChange(event.target.value as SupportedLanguage)}
      renderValue={(value) => (value === 'sw' ? 'SW' : 'EN')}
      sx={{
        minWidth: 74,
        background: '#fff',
        '& .MuiSelect-select': {
          minHeight: 'auto',
          py: 0.75,
          pr: '28px !important',
          pl: 1.25,
          fontSize: '0.82rem',
          fontWeight: 800
        }
      }}
    >
      <MenuItem value="en">{t('english')}</MenuItem>
      <MenuItem value="sw">{t('swahili')}</MenuItem>
    </Select>
  );
}
