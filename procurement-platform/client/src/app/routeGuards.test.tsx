import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { assumeUser, signOut } from '@/features/auth/slice';
import { demoUsers } from '@/shared/data/fixtures';
import { store } from './store';
import { AdminRoute, ProtectedRoute } from './routeGuards';

function renderGuarded(route: 'protected' | 'admin') {
  const Guard = route === 'protected' ? ProtectedRoute : AdminRoute;
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route === 'protected' ? '/private' : '/admin']}>
        <Routes>
          <Route path="/sign-in" element={<div>Sign in page</div>} />
          <Route path="/dashboard" element={<div>User dashboard</div>} />
          <Route
            path={route === 'protected' ? '/private' : '/admin'}
            element={
              <Guard>
                <div>Allowed</div>
              </Guard>
            }
          />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

describe('route guards', () => {
  beforeEach(() => {
    store.dispatch(assumeUser(demoUsers.user));
  });

  it('redirects unauthenticated users away from protected routes', () => {
    store.dispatch(signOut());
    renderGuarded('protected');
    expect(screen.getByText('Sign in page')).toBeInTheDocument();
  });

  it('redirects normal users away from admin routes', () => {
    renderGuarded('admin');
    expect(screen.getByText('User dashboard')).toBeInTheDocument();
  });

  it('allows admin users into admin routes', () => {
    store.dispatch(assumeUser(demoUsers.admin));
    renderGuarded('admin');
    expect(screen.getByText('Allowed')).toBeInTheDocument();
  });
});
