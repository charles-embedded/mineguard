import React from 'react';
import {
  AlertTriangle,
  Activity,
  Video,
  BrainCircuit,
  HardHat,
} from 'lucide-react';
import { useMineData } from '../context/MineDataContext';
import { MetricCard } from '../components/common/MetricCard';
import { SafetyStatusBanner } from '../components/dashboard/SafetyStatusBanner';
import { WorkerTable } from '../components/dashboard/WorkerTable';
import { AlertFeed } from '../components/dashboard/AlertFeed';
import { ZoneCctvGrid } from '../components/dashboard/ZoneCctvGrid';
import { SensorCategoryGrid } from '../components/dashboard/SensorCategoryGrid';
import { AISafetyFeed } from '../components/dashboard/AISafetyFeed';
import { InteractiveMineMap } from '../components/map/InteractiveMineMap';

export const OverviewPage: React.FC = () => {
  const { workers, alerts, aiEvents, setActiveTab } = useMineData();

  const activeAlertsCount = alerts.filter((a) => a.status === 'ACTIVE').length;
  const criticalAlertsCount = alerts.filter((a) => a.severity === 'CRITICAL' && a.status === 'ACTIVE').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Master Safety Status Panel */}
      <SafetyStatusBanner />

      {/* 2. Five Primary Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Workers Underground */}
        <MetricCard
          title="Workers Underground"
          value={workers.length}
          subtext="22 Safe • 2 Need Attention"
          icon={<HardHat size={20} />}
          variant="neutral"
          badgeText="Active Roster"
          onClick={() => setActiveTab('workers')}
        />

        {/* Active Alerts */}
        <MetricCard
          title="Active Alerts"
          value={activeAlertsCount}
          subtext={`${criticalAlertsCount} Critical • 1 Warning`}
          icon={<AlertTriangle size={20} />}
          variant={criticalAlertsCount > 0 ? 'red' : 'amber'}
          badgeText={criticalAlertsCount > 0 ? 'Hazard Trigger' : 'Elevated'}
          onClick={() => setActiveTab('alerts')}
        />

        {/* Sensors Online */}
        <MetricCard
          title="Sensors Online"
          value="47 / 50"
          subtext="94.0% Mesh Packet Rate"
          icon={<Activity size={20} />}
          variant="green"
          badgeText="LoRa Mesh OK"
          onClick={() => setActiveTab('sensors')}
        />

        {/* CCTV Zones */}
        <MetricCard
          title="CCTV Zones"
          value="6 / 6"
          subtext="All optical feeds active"
          icon={<Video size={20} />}
          variant="blue"
          badgeText="1080p 30fps"
          onClick={() => setActiveTab('cctv-zones')}
        />

        {/* AI Safety Events */}
        <MetricCard
          title="AI Safety Events"
          value={aiEvents.length}
          subtext="2 Immobile • 1 Zone Breach"
          icon={<BrainCircuit size={20} />}
          variant="amber"
          badgeText="YOLOv8 Vision"
          onClick={() => setActiveTab('ai-safety')}
        />
      </div>

      {/* 3. Subsurface Schematic Mine Map */}
      <InteractiveMineMap height="290px" isCompact={true} />

      {/* 4. Two-Column Dashboard Section: Worker Table & Live Alert Feed */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)',
          gap: '20px',
        }}
      >
        <WorkerTable limit={8} showFilters={false} />
        <AlertFeed limit={4} />
      </div>

      {/* 5. Two-Column Dashboard Section: Zone CCTV Matrix & Sensor Breakdown */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: '20px',
        }}
      >
        <ZoneCctvGrid limit={6} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <SensorCategoryGrid />
          <AISafetyFeed limit={3} />
        </div>
      </div>
    </div>
  );
};
