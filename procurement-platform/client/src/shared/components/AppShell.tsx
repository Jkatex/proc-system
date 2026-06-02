import { Outlet } from 'react-router-dom';
import { SidebarNav } from './SidebarNav';
import { TopBar } from './TopBar';

export function AppShell() {
  return (
    <div className="px-app-layout">
      <SidebarNav />
      <div className="px-main">
        <TopBar />
        <main id="main-content" className="px-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
