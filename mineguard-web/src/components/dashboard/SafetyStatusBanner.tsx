import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Radio,
  Activity,
  RefreshCw,
} from 'lucide-react';
import { useMineData } from '../../context/MineDataContext';
import type { Worker } from '../../types/mine';

export const SafetyStatusBanner: React.FC = () => {
  const { workers, alerts, lastUpdated, isSimulating } = useMineData();

  const criticalWorkers = workers.filter((w: Worker) => w.status === 'CRITICAL').length;
  const warningWorkers = workers.filter((w: Worker) => w.status === 'WARNING').length;
  const criticalAlerts = alerts.filter((a) => a.severity === 'CRITICAL' && a.status === 'ACTIVE').length;

  const isElevated = criticalAlerts > 0 || criticalWorkers > 0;

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        border: `1px solid ${isElevated ? 'var(--danger-red-border)' : 'var(--safety-green-border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: isElevated ? 'var(--shadow-glow-red)' : 'var(--shadow-card)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow highlight strip */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          backgroundColor: isElevated ? 'var(--danger-red)' : 'var(--safety-green)',
        }}
      />

      {/* Main Status & Heading */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: isElevated ? 'var(--danger-red-bg)' : 'var(--safety-green-bg)',
            border: `1px solid ${isElevated ? 'var(--danger-red-border)' : 'var(--safety-green-border)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isElevated ? 'var(--danger-red)' : 'var(--safety-green)',
            flexShrink: 0,
          }}
        >
          {isElevated ? (
            <ShieldAlert size={26} strokeWidth={2.2} />
          ) : (
            <ShieldCheck size={26} strokeWidth={2.2} />
          )}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-mono)',
                color: isElevated ? 'var(--danger-red)' : 'var(--safety-green)',
              }}
            >
              MINE SAFETY STATUS
            </span>
            <span
              style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isElevated ? 'var(--danger-red-bg)' : 'var(--safety-green-bg)',
                color: isElevated ? 'var(--danger-red)' : 'var(--safety-green)',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
              }}
            >
              {isElevated ? 'ELEVATED HAZARD' : 'ALL CLEAR'}
            </span>
          </div>

          <h2
            style={{
              fontSize: '17px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginTop: '2px',
              letterSpacing: '-0.01em',
            }}
          >
            OPERATIONAL — MONITORING ACTIVE
          </h2>

          <div
            style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: '4px',
            }}
          >
            <span>
              Underground Subsurface: <strong style={{ color: 'var(--text-primary)' }}>{workers.length} Personnel</strong>
            </span>
            <span>•</span>
            <span style={{ color: criticalWorkers > 0 ? 'var(--danger-red)' : 'var(--text-secondary)' }}>
              Critical Warnings: <strong style={{ color: criticalWorkers > 0 ? 'var(--danger-red)' : 'var(--text-primary)' }}>{criticalWorkers}</strong>
            </span>
            <span>•</span>
            <span style={{ color: warningWorkers > 0 ? 'var(--warning-amber)' : 'var(--text-secondary)' }}>
              Elevated: <strong style={{ color: warningWorkers > 0 ? 'var(--warning-amber)' : 'var(--text-primary)' }}>{warningWorkers}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Subsystem Health Metrics */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          backgroundColor: 'var(--bg-card-inner)',
          padding: '10px 18px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Activity size={12} style={{ color: 'var(--safety-green)' }} />
            <span>Sensor Network</span>
          </div>
          <div className="mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
            47 / 50 Online <span style={{ fontSize: '11px', color: 'var(--safety-green)' }}>(94%)</span>
          </div>
        </div>

        <div style={{ width: '1px', height: '28px', backgroundColor: 'var(--border-subtle)' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Radio size={12} style={{ color: 'var(--info-cyan)' }} />
            <span>LoRa Mesh Comms</span>
          </div>
          <div className="mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
            CH-8 (868.10 MHz) <span style={{ fontSize: '11px', color: 'var(--info-cyan)' }}>-64 dBm</span>
          </div>
        </div>

        <div style={{ width: '1px', height: '28px', backgroundColor: 'var(--border-subtle)' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <RefreshCw size={12} className={isSimulating ? 'spin-subtle' : ''} style={{ color: 'var(--warning-amber)' }} />
            <span>Last Telemetry Sync</span>
          </div>
          <div className="mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {lastUpdated.toLocaleTimeString()} <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>LIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
