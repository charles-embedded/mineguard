import React, { useState } from 'react';
import { MineDataProvider, useMineData } from './context/MineDataContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { WorkerDetailModal } from './components/workers/WorkerDetailModal';

// Pages
import { OverviewPage } from './pages/OverviewPage';
import { WorkersPage } from './pages/WorkersPage';
import { MineMapPage } from './pages/MineMapPage';
import { CctvZonesPage } from './pages/CctvZonesPage';
import { SensorsPage } from './pages/SensorsPage';
import { AISafetyPage } from './pages/AISafetyPage';
import { AlertsPage } from './pages/AlertsPage';
import { DevicesPage } from './pages/DevicesPage';
import { SystemLogsPage } from './pages/SystemLogsPage';
import { SettingsPage } from './pages/SettingsPage';

const MainContent: React.FC = () => {
  const { activeTab } = useMineData();
  const [globalSearch, setGlobalSearch] = useState<string>('');

  const renderActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage />;
      case 'workers':
        return <WorkersPage />;
      case 'mine-map':
        return <MineMapPage />;
      case 'cctv-zones':
        return <CctvZonesPage />;
      case 'sensors':
        return <SensorsPage />;
      case 'ai-safety':
        return <AISafetyPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'devices':
        return <DevicesPage />;
      case 'system-logs':
        return <SystemLogsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-base)',
      }}
    >
      <Header
        searchQuery={globalSearch}
        onSearchChange={activeTab === 'workers' || activeTab === 'overview' ? setGlobalSearch : undefined}
      />

      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          backgroundColor: 'var(--bg-base)',
        }}
      >
        <div
          style={{
            maxWidth: '1600px',
            margin: '0 auto',
          }}
        >
          {renderActivePage()}
        </div>
      </main>

      {/* Global Worker Telemetry Modal */}
      <WorkerDetailModal />
    </div>
  );
};

export function App() {
  return (
    <MineDataProvider>
      <div
        style={{
          display: 'flex',
          width: '100vw',
          height: '100vh',
          backgroundColor: 'var(--bg-base)',
          color: 'var(--text-primary)',
          overflow: 'hidden',
        }}
      >
        <Sidebar />
        <MainContent />
      </div>
    </MineDataProvider>
  );
}

export default App;
