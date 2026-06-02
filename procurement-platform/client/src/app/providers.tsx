import { CssBaseline, ThemeProvider } from '@mui/material';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { procurexTheme } from '@/styles/mui-theme';
import { store } from './store';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={procurexTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Provider>
  );
}
