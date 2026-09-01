import React from 'react';
import {
  AlertTriangle,
  Flame,
  UserX,
  Thermometer,
  WifiOff,
  CheckCircle2,
  Clock,
  MapPin,
} from 'lucide-react';
import { useMineData } from '../../context/MineDataContext';
import { StatusBadge } from '../common/StatusBadge';
import type { SafetyAlert } from '../../types/mine';

interface AlertFeedProps {
  limit?: number;
}

export const AlertFeed: React.FC<AlertFeedProps> = ({ limit }) => {
  const { alerts, acknowledgeAlert, setActiveTab } = useMineData();

  const displayAlerts = limit ? alerts.slice(0, limit) : alerts;

  const getCategoryIcon = (cat: SafetyAlert['category']) => {
    switch (cat) {
      case 'GAS':
        return <Flame size={16} style={{ color: 'var(--danger-red)' }} />;
      case 'IMMOBILITY':
        return <UserX size={16} style={{ color: 'var(--danger-red)' }} />;
      case 'TEMPERATURE':
        return <Thermometer size={16} style={{ color: 'var(--warning-amber)' }} />;
      case 'COMMUNICATION':
        return <WifiOff size={16} style={{ color: 'var(--text-muted)' }} />;
      default:
        return <AlertTriangle size={16} style={{ color: 'var(--warning-amber)' }} />;
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 18px',
          backgroundColor: 'var(--bg-card-inner)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--danger-red-bg)',
              color: 'var(--danger-red)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Safety Alarms & Incident Dispatch
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Real-time threshold triggers & event warnings
            </p>
          </div>
        </div>

        <span
          style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--danger-red-bg)',
            color: 'var(--danger-red)',
            fontWeight: 700,
          }}
        >
          {alerts.filter((a: SafetyAlert) => a.status === 'ACTIVE').length} ACTIVE
        </span>
      </div>

      {/* Alert items list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: 'var(--border-subtle)' }}>
        {displayAlerts.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-card)' }}>
            No active safety alerts reported in the mine.
          </div>
        ) : (
          displayAlerts.map((alert: SafetyAlert) => {
            const isCritical = alert.severity === 'CRITICAL';
            const isActive = alert.status === 'ACTIVE';

            return (
              <div
                key={alert.id}
                style={{
                  padding: '14px 18px',
                  backgroundColor: isActive && isCritical ? 'rgba(239, 68, 68, 0.05)' : 'var(--bg-card)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '14px',
                  borderLeft: `3px solid ${
                    isCritical ? 'var(--danger-red)' : alert.severity === 'WARNING' ? 'var(--warning-amber)' : 'var(--safety-green)'
                  }`,
                  transition: 'background-color 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-card-inner)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {getCategoryIcon(alert.category)}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="mono" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>
                        {alert.id}
                      </span>
                      <StatusBadge status={alert.severity} size="sm" pulse={isActive && isCritical} />
                      <StatusBadge status={alert.status} size="sm" />
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={11} /> {alert.timestamp}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                      {alert.title}
                    </h4>

                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                      {alert.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px', fontSize: '11px' }}>
                      <span style={{ color: 'var(--info-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={11} /> {alert.zoneName}
                      </span>

                      {alert.workerName && (
                        <span style={{ color: 'var(--text-secondary)' }}>
                          Worker: <strong style={{ color: 'var(--text-primary)' }}>{alert.workerName} ({alert.workerId})</strong>
                        </span>
                      )}

                      {alert.telemetryValue && (
                        <span className="mono" style={{ color: 'var(--industrial-gold)', backgroundColor: 'var(--bg-card-inner)', padding: '1px 6px', borderRadius: '3px' }}>
                          {alert.telemetryValue}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Acknowledge or Details action */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                  {isActive && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'rgba(245, 158, 11, 0.15)',
                        border: '1px solid var(--warning-amber-border)',
                        color: 'var(--warning-amber)',
                        fontSize: '11px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.25)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.15)';
                      }}
                    >
                      <CheckCircle2 size={12} />
                      ACKNOWLEDGE
                    </button>
                  )}
                  {alert.acknowledgedBy && (
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      Ack: {alert.acknowledgedBy} @ {alert.acknowledgedAt}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {limit && alerts.length > limit && (
        <div
          style={{
            padding: '10px 18px',
            backgroundColor: 'var(--bg-card-inner)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Showing {displayAlerts.length} recent events
          </span>
          <button
            onClick={() => setActiveTab('alerts')}
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--info-cyan)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Open Safety Incident Matrix &rarr;
          </button>
        </div>
      )}
    </div>
  );
};
