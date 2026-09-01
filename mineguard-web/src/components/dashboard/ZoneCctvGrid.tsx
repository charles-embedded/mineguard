import React from 'react';
import {
  Video,
  BrainCircuit,
} from 'lucide-react';
import { useMineData } from '../../context/MineDataContext';
import { StatusBadge } from '../common/StatusBadge';
import type { MineZone, AISafetyEvent } from '../../types/mine';

interface ZoneCctvGridProps {
  onSelectZone?: (zone: MineZone) => void;
  limit?: number;
}

export const ZoneCctvGrid: React.FC<ZoneCctvGridProps> = ({ onSelectZone, limit }) => {
  const { zones, aiEvents, setActiveTab, setSelectedZone } = useMineData();

  const displayZones = limit ? zones.slice(0, limit) : zones;

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
              backgroundColor: 'rgba(6, 182, 212, 0.15)',
              color: 'var(--info-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Video size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Subsurface CCTV & Zone Surveillance Matrix
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Simulated 6-channel optical feeds with YOLOv8 Edge AI analytics
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--safety-green-bg)',
              color: 'var(--safety-green)',
              fontWeight: 700,
            }}
          >
            6/6 CHANNELS ONLINE
          </span>
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          padding: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '14px',
        }}
      >
        {displayZones.map((zone: MineZone) => {
          const zoneAiEvents = aiEvents.filter((e: AISafetyEvent) => e.zone === zone.id && e.status === 'ACTIVE');
          const hasAiAlert = zoneAiEvents.length > 0;
          const isCritical = zone.safetyStatus === 'HAZARD';

          return (
            <div
              key={zone.id}
              onClick={() => {
                setSelectedZone(zone);
                if (onSelectZone) onSelectZone(zone);
              }}
              style={{
                backgroundColor: 'var(--bg-card-inner)',
                border: `1px solid ${
                  isCritical ? 'var(--danger-red-border)' : hasAiAlert ? 'var(--warning-amber-border)' : 'var(--border-subtle)'
                }`,
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isCritical
                  ? 'var(--danger-red-border)'
                  : hasAiAlert
                  ? 'var(--warning-amber-border)'
                  : 'var(--border-subtle)';
              }}
            >
              {/* CCTV Feed Simulation Header */}
              <div
                className="cctv-screen"
                style={{
                  height: '140px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '10px',
                }}
              >
                {/* HUD Top Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 3 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#ef4444',
                        boxShadow: '0 0 6px #ef4444',
                      }}
                    />
                    <span
                      className="mono"
                      style={{ fontSize: '10px', color: '#f87171', fontWeight: 700, letterSpacing: '0.06em' }}
                    >
                      REC
                    </span>
                    <span className="mono" style={{ fontSize: '10px', color: '#94a3b8', marginLeft: '4px' }}>
                      {zone.cctvCameraId}
                    </span>
                  </div>

                  <div className="mono" style={{ fontSize: '10px', color: '#64748b' }}>
                    1080P • 30FPS
                  </div>
                </div>

                {/* Simulated AI Bounding Box Overlay if AI Alert */}
                {hasAiAlert && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '30%',
                      left: '25%',
                      width: '50%',
                      height: '50%',
                      border: `1.5px dashed ${isCritical ? '#ef4444' : '#f59e0b'}`,
                      backgroundColor: isCritical ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                      zIndex: 3,
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      padding: '2px 4px',
                    }}
                  >
                    <span
                      className="mono"
                      style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        backgroundColor: isCritical ? '#ef4444' : '#f59e0b',
                        color: '#000',
                        padding: '1px 3px',
                        borderRadius: '2px',
                      }}
                    >
                      {zoneAiEvents[0].title.toUpperCase()} [94%]
                    </span>
                  </div>
                )}

                {/* Subsurface Tunnel Silhouette Graphic */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '60px',
                    opacity: 0.25,
                    background: 'radial-gradient(ellipse at bottom, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* HUD Bottom Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    zIndex: 3,
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    color: '#94a3b8',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <BrainCircuit size={12} style={{ color: hasAiAlert ? '#f59e0b' : 'var(--safety-green)' }} />
                    <span>AI: {zone.aiMonitoringStatus}</span>
                  </div>
                  <span>Depth: -{zone.depthMeters}m</span>
                </div>
              </div>

              {/* Zone Telemetry Details */}
              <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>
                    {zone.name}
                  </div>
                  <StatusBadge status={zone.safetyStatus} size="sm" />
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '6px',
                    backgroundColor: 'var(--bg-card)',
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Workers</div>
                    <div className="mono" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {zone.workerCount} Pers
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>CH4 Gas</div>
                    <div
                      className="mono"
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: zone.gasMethanePpm > 45 ? 'var(--danger-red)' : 'var(--text-primary)',
                      }}
                    >
                      {zone.gasMethanePpm} ppm
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Temp</div>
                    <div className="mono" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {zone.ambientTemp} °C
                    </div>
                  </div>
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
            All 6 subsurface camera feeds operational
          </span>
          <button
            onClick={() => setActiveTab('cctv-zones')}
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--info-cyan)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Open Full CCTV Grid &rarr;
          </button>
        </div>
      )}
    </div>
  );
};
