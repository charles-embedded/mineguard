import React, { useState } from 'react';
import {
  Video,
  Eye,
  Maximize2,
  HardHat,
  Thermometer,
  CloudAlert,
  Wind,
} from 'lucide-react';
import { useMineData } from '../context/MineDataContext';
import { StatusBadge } from '../components/common/StatusBadge';
import type { MineZone, AISafetyEvent } from '../types/mine';

export const CctvZonesPage: React.FC = () => {
  const { zones, aiEvents } = useMineData();
  const [activeZoneId, setActiveZoneId] = useState<string>('ZONE_B');

  const selectedZone = zones.find((z: MineZone) => z.id === activeZoneId) || zones[0];
  const zoneAiEvents = aiEvents.filter((e: AISafetyEvent) => e.zone === selectedZone.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 2-Column Split: Big Focus View & Zone Selector Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
        {/* Big Selected CCTV Feed Canvas */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Main Feed Header */}
          <div
            style={{
              padding: '12px 18px',
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
                  {selectedZone.name} — Focus Feed
                </h3>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Camera Node: {selectedZone.cctvCameraId} • -{selectedZone.depthMeters}m Depth
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <StatusBadge status={selectedZone.safetyStatus} size="sm" />
              <button
                title="Fullscreen mode"
                style={{
                  padding: '5px 8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                }}
              >
                <Maximize2 size={12} />
              </button>
            </div>
          </div>

          {/* CCTV Feed Screen */}
          <div
            className="cctv-screen"
            style={{
              height: '320px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '16px',
            }}
          >
            {/* Top HUD */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#ef4444',
                    boxShadow: '0 0 8px #ef4444',
                  }}
                />
                <span className="mono" style={{ fontSize: '11px', color: '#f87171', fontWeight: 800, letterSpacing: '0.08em' }}>
                  REC LIVE
                </span>
                <span className="mono" style={{ fontSize: '11px', color: '#cbd5e1', marginLeft: '6px' }}>
                  {selectedZone.cctvCameraId} (1080P/30FPS H.265)
                </span>
              </div>

              <div className="mono" style={{ fontSize: '11px', color: '#94a3b8' }}>
                BITRATE: 4.8 Mbps • LATENCY: 28ms
              </div>
            </div>

            {/* Bounding Box HUD if any AI event */}
            {zoneAiEvents.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '25%',
                  left: '30%',
                  width: '40%',
                  height: '45%',
                  border: '2px dashed #f59e0b',
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  zIndex: 3,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  padding: '4px 6px',
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    backgroundColor: '#f59e0b',
                    color: '#000',
                    padding: '2px 5px',
                    borderRadius: '2px',
                  }}
                >
                  AI: {zoneAiEvents[0].title.toUpperCase()} (CONF: {zoneAiEvents[0].confidenceScore}%)
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
                height: '140px',
                opacity: 0.2,
                background: 'radial-gradient(ellipse at bottom, rgba(59, 130, 246, 0.4) 0%, transparent 80%)',
                pointerEvents: 'none',
              }}
            />

            {/* Bottom HUD */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 3,
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: '#cbd5e1',
                backgroundColor: 'rgba(11, 17, 32, 0.65)',
                padding: '6px 10px',
                borderRadius: '4px',
              }}
            >
              <span>AIRFLOW: {selectedZone.airflowVelocity} m/s</span>
              <span>CH4: {selectedZone.gasMethanePpm} ppm</span>
              <span>TEMP: {selectedZone.ambientTemp} °C</span>
              <span>HUMIDITY: {selectedZone.humidity}%</span>
              <span>PERSONNEL: {selectedZone.workerCount}</span>
            </div>
          </div>

          {/* Telemetry and Specs for Selected Sector */}
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {selectedZone.description}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              <div
                style={{
                  backgroundColor: 'var(--bg-card-inner)',
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <HardHat size={12} /> Personnel
                </div>
                <div className="mono" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {selectedZone.workerCount} Workers
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--bg-card-inner)',
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CloudAlert size={12} /> Methane (CH4)
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: selectedZone.gasMethanePpm > 40 ? 'var(--danger-red)' : 'var(--safety-green)',
                    marginTop: '2px',
                  }}
                >
                  {selectedZone.gasMethanePpm} ppm
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--bg-card-inner)',
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Thermometer size={12} /> Ambient Temp
                </div>
                <div className="mono" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {selectedZone.ambientTemp} °C
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--bg-card-inner)',
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Wind size={12} /> Airflow Velocity
                </div>
                <div className="mono" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {selectedZone.airflowVelocity} m/s
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6-Zone Selection Channels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Subsurface CCTV Matrix (6 Channels)</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Click to inspect
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {zones.map((zone: MineZone) => {
              const isSelected = zone.id === activeZoneId;
              const hasHazard = zone.safetyStatus === 'HAZARD';

              return (
                <div
                  key={zone.id}
                  onClick={() => setActiveZoneId(zone.id)}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: `1.5px solid ${isSelected ? 'var(--info-cyan)' : hasHazard ? 'var(--danger-red-border)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div
                    className="cctv-screen"
                    style={{
                      height: '95px',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 3 }}>
                      <span className="mono" style={{ fontSize: '9px', color: '#f87171', fontWeight: 800 }}>
                        ● REC
                      </span>
                      <span className="mono" style={{ fontSize: '9px', color: '#94a3b8' }}>
                        {zone.cctvCameraId}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 3 }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#f1f5f9' }}>
                        {zone.code}
                      </span>
                      <span className="mono" style={{ fontSize: '9px', color: '#cbd5e1' }}>
                        -{zone.depthMeters}m
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {zone.name.replace(/Zone [A-F] — /, '')}
                      </div>
                      <div className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        {zone.workerCount} Pers • {zone.gasMethanePpm} ppm CH4
                      </div>
                    </div>

                    {isSelected && (
                      <span style={{ color: 'var(--info-cyan)', display: 'flex', alignItems: 'center' }}>
                        <Eye size={14} />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
