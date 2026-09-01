import React from 'react';
import {
  BrainCircuit,
  UserX,
  ShieldAlert,
  Users,
  Timer,
  AlertTriangle,
  Camera,
  Clock,
} from 'lucide-react';
import { useMineData } from '../../context/MineDataContext';
import { StatusBadge } from '../common/StatusBadge';
import type { AISafetyEvent } from '../../types/mine';

interface AISafetyFeedProps {
  limit?: number;
}

export const AISafetyFeed: React.FC<AISafetyFeedProps> = ({ limit }) => {
  const { aiEvents, setActiveTab } = useMineData();

  const displayEvents = limit ? aiEvents.slice(0, limit) : aiEvents;

  const getEventIcon = (type: AISafetyEvent['eventType']) => {
    switch (type) {
      case 'WORKER_IMMOBILITY':
        return <UserX size={16} style={{ color: 'var(--danger-red)' }} />;
      case 'POTENTIAL_CASUALTY':
        return <ShieldAlert size={16} style={{ color: 'var(--danger-red)' }} />;
      case 'RESTRICTED_ZONE_ENTRY':
        return <AlertTriangle size={16} style={{ color: 'var(--warning-amber)' }} />;
      case 'CROWD_DETECTED':
        return <Users size={16} style={{ color: 'var(--info-cyan)' }} />;
      case 'PROLONGED_INACTIVITY':
        return <Timer size={16} style={{ color: 'var(--text-muted)' }} />;
      default:
        return <BrainCircuit size={16} style={{ color: 'var(--info-cyan)' }} />;
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
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              color: 'var(--info-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BrainCircuit size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              AI Vision & Anomaly Detection Engine
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              YOLOv8 Edge Computer Vision & Multi-Sensor Fusion
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              color: 'var(--info-cyan)',
              fontWeight: 700,
            }}
          >
            CONFIDENCE &gt; 88%
          </span>
        </div>
      </div>

      {/* Events List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: 'var(--border-subtle)' }}>
        {displayEvents.map((evt: AISafetyEvent) => {
          const isCritical = evt.severity === 'CRITICAL';
          return (
            <div
              key={evt.id}
              style={{
                padding: '14px 18px',
                backgroundColor: isCritical ? 'rgba(239, 68, 68, 0.04)' : 'var(--bg-card)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                transition: 'background-color 0.15s ease',
              }}
            >
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
                {getEventIcon(evt.eventType)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="mono" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>
                    {evt.id}
                  </span>
                  <StatusBadge status={evt.severity} size="sm" pulse={isCritical} />
                  <StatusBadge status={evt.status} size="sm" />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={11} /> {evt.timestamp}
                  </span>
                  <span
                    className="mono"
                    style={{
                      fontSize: '11px',
                      color: 'var(--industrial-gold)',
                      backgroundColor: 'var(--bg-card-inner)',
                      padding: '1px 5px',
                      borderRadius: '2px',
                      fontWeight: 700,
                    }}
                  >
                    Conf: {evt.confidenceScore}%
                  </span>
                </div>

                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {evt.title}
                </h4>

                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                  {evt.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px', fontSize: '11px' }}>
                  <span style={{ color: 'var(--info-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Camera size={11} /> Camera: {evt.cameraId} ({evt.zoneName})
                  </span>

                  {evt.detectedWorkers && evt.detectedWorkers.length > 0 && (
                    <span style={{ color: 'var(--text-secondary)' }}>
                      Target: <strong style={{ color: 'var(--text-primary)' }}>{evt.detectedWorkers.join(', ')}</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {limit && (
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
            Inference engine: Jetson Orin Nano (Latency: 42ms)
          </span>
          <button
            onClick={() => setActiveTab('ai-safety')}
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--info-cyan)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            AI Safety Model Analytics &rarr;
          </button>
        </div>
      )}
    </div>
  );
};
