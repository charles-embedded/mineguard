import React from 'react';
import {
  HardHat,
  ShieldCheck,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { useMineData } from '../context/MineDataContext';
import { MetricCard } from '../components/common/MetricCard';
import { WorkerTable } from '../components/dashboard/WorkerTable';
import type { Worker, MineZone } from '../types/mine';

export const WorkersPage: React.FC = () => {
  const { workers, zones } = useMineData();

  const totalWorkers = workers.length;
  const safeWorkers = workers.filter((w: Worker) => w.status === 'SAFE').length;
  const warningWorkers = workers.filter((w: Worker) => w.status === 'WARNING').length;
  const criticalWorkers = workers.filter((w: Worker) => w.status === 'CRITICAL').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top 4 Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        <MetricCard
          title="Total Underground"
          value={totalWorkers}
          subtext="Personnel registered underground"
          icon={<HardHat size={20} />}
          variant="blue"
          badgeText="Active Shift #4"
        />

        <MetricCard
          title="Normal Bio-Status"
          value={safeWorkers}
          subtext="Normal heart rate, gas & IMU"
          icon={<ShieldCheck size={20} />}
          variant="green"
          badgeText={`${Math.round((safeWorkers / totalWorkers) * 100)}% Safe`}
        />

        <MetricCard
          title="Elevated Monitoring"
          value={warningWorkers}
          subtext="Temperature / Gas threshold alert"
          icon={<AlertTriangle size={20} />}
          variant="amber"
          badgeText="Attention"
        />

        <MetricCard
          title="Critical / SOS Alarm"
          value={criticalWorkers}
          subtext="Immobility or emergency broadcast"
          icon={<Radio size={20} />}
          variant="red"
          badgeText={criticalWorkers > 0 ? 'Urgent Response' : 'All Clear'}
        />
      </div>

      {/* Main Interactive Table */}
      <WorkerTable showFilters={true} />

      {/* Sector Headcount Distribution */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 20px',
        }}
      >
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Subsurface Sector Distribution
        </h3>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          Real-time personnel allocation across 6 underground mining zones
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
          {zones.map((zone: MineZone) => {
            const count = workers.filter((w: Worker) => w.zone === zone.id).length;
            return (
              <div
                key={zone.id}
                style={{
                  backgroundColor: 'var(--bg-card-inner)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {zone.name.replace(/Zone [A-F] — /, '')}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {zone.code} • -{zone.depthMeters}m
                  </div>
                </div>

                <div
                  className="mono"
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: 'var(--info-cyan)',
                  }}
                >
                  {count} <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>pers</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
