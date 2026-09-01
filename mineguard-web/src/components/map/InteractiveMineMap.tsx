import React, { useState } from 'react';
import {
  Map,
  Video,
  Activity,
  AlertTriangle,
  HardHat,
} from 'lucide-react';
import { useMineData } from '../../context/MineDataContext';
import type { MineZone, Worker, SafetyAlert } from '../../types/mine';

interface InteractiveMineMapProps {
  height?: string;
  isCompact?: boolean;
}

export const InteractiveMineMap: React.FC<InteractiveMineMapProps> = ({
  height = '520px',
  isCompact = false,
}) => {
  const { zones, workers, alerts, setSelectedWorker, setSelectedZone, setActiveTab } = useMineData();

  const [showWorkers, setShowWorkers] = useState<boolean>(true);
  const [showCctv, setShowCctv] = useState<boolean>(true);
  const [showSensors, setShowSensors] = useState<boolean>(true);
  const [showAlerts, setShowAlerts] = useState<boolean>(true);
  const [selectedMapZone, setSelectedMapZone] = useState<MineZone | null>(null);

  // Active alerts per zone
  const activeAlerts = alerts.filter((a: SafetyAlert) => a.status === 'ACTIVE');

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
      {/* Map Control Bar */}
      <div
        style={{
          padding: '12px 18px',
          backgroundColor: 'var(--bg-card-inner)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
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
            <Map size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Subsurface Schematic Mine Map & Node Locator
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Central Mining Zone — Shaft #4 (-310m Subsurface Level)
            </p>
          </div>
        </div>

        {/* Layer Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowWorkers(!showWorkers)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              backgroundColor: showWorkers ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-card)',
              color: showWorkers ? 'var(--info-cyan)' : 'var(--text-muted)',
              border: `1px solid ${showWorkers ? 'rgba(59, 130, 246, 0.4)' : 'var(--border-subtle)'}`,
            }}
          >
            <HardHat size={12} />
            Workers ({workers.length})
          </button>

          <button
            onClick={() => setShowCctv(!showCctv)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              backgroundColor: showCctv ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-card)',
              color: showCctv ? 'var(--safety-green)' : 'var(--text-muted)',
              border: `1px solid ${showCctv ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)'}`,
            }}
          >
            <Video size={12} />
            CCTV (6)
          </button>

          <button
            onClick={() => setShowSensors(!showSensors)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              backgroundColor: showSensors ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-card)',
              color: showSensors ? 'var(--warning-amber)' : 'var(--text-muted)',
              border: `1px solid ${showSensors ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-subtle)'}`,
            }}
          >
            <Activity size={12} />
            Sensors (14)
          </button>

          <button
            onClick={() => setShowAlerts(!showAlerts)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              backgroundColor: showAlerts ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-card)',
              color: showAlerts ? 'var(--danger-red)' : 'var(--text-muted)',
              border: `1px solid ${showAlerts ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-subtle)'}`,
            }}
          >
            <AlertTriangle size={12} />
            Alerts ({activeAlerts.length})
          </button>

          {isCompact && (
            <button
              onClick={() => setActiveTab('mine-map')}
              title="Open full interactive map"
              style={{
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--info-cyan)',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              Full Map &rarr;
            </button>
          )}
        </div>
      </div>

      {/* SVG Mine Map Canvas */}
      <div
        style={{
          position: 'relative',
          height: height,
          width: '100%',
          backgroundColor: '#070a11',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          viewBox="0 0 1000 320"
          style={{ width: '100%', height: '100%', userSelect: 'none' }}
        >
          {/* Grid pattern */}
          <defs>
            <pattern id="mineGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#161f33" strokeWidth="0.8" />
            </pattern>
            {/* Ventilation animation arrow pattern */}
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" opacity="0.6" />
            </marker>
            <marker id="arrow-warn" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" opacity="0.6" />
            </marker>
          </defs>

          <rect width="1000" height="320" fill="#070a11" />
          <rect width="1000" height="320" fill="url(#mineGrid)" />

          {/* Subsurface Tunnel Connection Drifts (Paths) */}
          {/* Shaft C down to Main Tunnel A */}
          <path d="M 220 130 L 220 180" stroke="#253554" strokeWidth="24" strokeLinecap="round" />
          {/* Main Tunnel A to Extraction B */}
          <path d="M 380 215 L 420 215" stroke="#253554" strokeWidth="28" strokeLinecap="round" />
          {/* Shaft C to Conveyor D */}
          <path d="M 320 90 L 420 90" stroke="#253554" strokeWidth="22" strokeLinecap="round" />
          {/* Conveyor D to Storage E */}
          <path d="M 660 90 L 740 90" stroke="#253554" strokeWidth="20" strokeLinecap="round" />
          {/* Extraction B to Maintenance F */}
          <path d="M 700 225 L 740 225" stroke="#253554" strokeWidth="22" strokeLinecap="round" />
          {/* Conveyor D down to Extraction B */}
          <path d="M 540 130 L 540 180" stroke="#253554" strokeWidth="18" strokeLinecap="round" />
          {/* Storage E down to Maintenance F */}
          <path d="M 845 150 L 845 190" stroke="#253554" strokeWidth="18" strokeLinecap="round" />

          {/* Airflow Direction Lines */}
          <path d="M 160 100 L 280 100" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="6,4" markerEnd="url(#arrow)" opacity="0.6" />
          <path d="M 220 130 L 220 170" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="6,4" markerEnd="url(#arrow)" opacity="0.6" />
          <path d="M 180 215 L 360 215" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="6,4" markerEnd="url(#arrow)" opacity="0.6" />
          <path d="M 440 225 L 680 225" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6,4" markerEnd="url(#arrow-warn)" opacity="0.6" />
          <path d="M 440 90 L 640 90" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="6,4" markerEnd="url(#arrow)" opacity="0.6" />

          {/* Mine Zones (Rectangular sectors) */}
          {zones.map((z: MineZone) => {
            const isHazard = z.safetyStatus === 'HAZARD';
            const isElevated = z.safetyStatus === 'ELEVATED';
            const isSelected = selectedMapZone?.id === z.id;

            let strokeColor = '#243352';
            let fillColor = 'rgba(15, 23, 42, 0.75)';

            if (isHazard) {
              strokeColor = '#ef4444';
              fillColor = 'rgba(239, 68, 68, 0.15)';
            } else if (isElevated) {
              strokeColor = '#f59e0b';
              fillColor = 'rgba(245, 158, 11, 0.12)';
            }

            if (isSelected) {
              strokeColor = '#38bdf8';
              fillColor = 'rgba(56, 189, 248, 0.18)';
            }

            return (
              <g
                key={z.id}
                onClick={() => {
                  setSelectedMapZone(z);
                  setSelectedZone(z);
                }}
                style={{ cursor: 'pointer' }}
              >
                {/* Sector outline */}
                <rect
                  x={z.mapCoordinates.x}
                  y={z.mapCoordinates.y}
                  width={z.mapCoordinates.width}
                  height={z.mapCoordinates.height}
                  rx="6"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isSelected ? 2 : 1.5}
                />

                {/* Zone Code Tag */}
                <rect
                  x={z.mapCoordinates.x + 8}
                  y={z.mapCoordinates.y + 8}
                  width="44"
                  height="18"
                  rx="3"
                  fill="#0b1120"
                  stroke={strokeColor}
                  strokeWidth="1"
                />
                <text
                  x={z.mapCoordinates.x + 30}
                  y={z.mapCoordinates.y + 21}
                  textAnchor="middle"
                  fill="#f1f5f9"
                  fontSize="10"
                  fontWeight="700"
                  fontFamily="var(--font-mono)"
                >
                  {z.code}
                </text>

                {/* Zone Name */}
                <text
                  x={z.mapCoordinates.x + 58}
                  y={z.mapCoordinates.y + 21}
                  fill="#94a3b8"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="var(--font-sans)"
                >
                  {z.name.replace(/Zone [A-F] — /, '')}
                </text>

                {/* Depth text */}
                <text
                  x={z.mapCoordinates.x + z.mapCoordinates.width - 10}
                  y={z.mapCoordinates.y + 20}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                >
                  -{z.depthMeters}m
                </text>

                {/* Telemetry pill inside zone */}
                <text
                  x={z.mapCoordinates.x + 12}
                  y={z.mapCoordinates.y + z.mapCoordinates.height - 12}
                  fill="#cbd5e1"
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                >
                  CH4: {z.gasMethanePpm} ppm • {z.ambientTemp}°C • {z.workerCount} Pers
                </text>
              </g>
            );
          })}

          {/* Environmental Sensor Markers */}
          {showSensors &&
            zones.map((z: MineZone) => (
              <g key={`sensor-${z.id}`}>
                <circle
                  cx={z.mapCoordinates.x + z.mapCoordinates.width - 24}
                  cy={z.mapCoordinates.y + z.mapCoordinates.height - 20}
                  r="7"
                  fill="#0f172a"
                  stroke={z.gasMethanePpm > 40 ? '#ef4444' : '#10b981'}
                  strokeWidth="1.5"
                />
                <text
                  x={z.mapCoordinates.x + z.mapCoordinates.width - 24}
                  y={z.mapCoordinates.y + z.mapCoordinates.height - 17}
                  textAnchor="middle"
                  fill={z.gasMethanePpm > 40 ? '#ef4444' : '#10b981'}
                  fontSize="8"
                  fontWeight="800"
                  fontFamily="var(--font-mono)"
                >
                  S
                </text>
              </g>
            ))}

          {/* CCTV Camera Markers */}
          {showCctv &&
            zones.map((z: MineZone) => (
              <g key={`cctv-${z.id}`}>
                <circle
                  cx={z.mapCoordinates.x + 20}
                  cy={z.mapCoordinates.y + 45}
                  r="7"
                  fill="#06b6d4"
                  stroke="#fff"
                  strokeWidth="1"
                />
                <path
                  d={`M ${z.mapCoordinates.x + 20} ${z.mapCoordinates.y + 45} L ${z.mapCoordinates.x + 70} ${
                    z.mapCoordinates.y + 35
                  } L ${z.mapCoordinates.x + 70} ${z.mapCoordinates.y + 55} Z`}
                  fill="rgba(6, 182, 212, 0.15)"
                />
              </g>
            ))}

          {/* Alert Markers */}
          {showAlerts &&
            activeAlerts.map((alt: SafetyAlert, i: number) => {
              const targetZone = zones.find((z: MineZone) => z.id === alt.zone);
              if (!targetZone) return null;
              const ax = targetZone.mapCoordinates.x + targetZone.mapCoordinates.width / 2 + (i * 20 - 10);
              const ay = targetZone.mapCoordinates.y + targetZone.mapCoordinates.height / 2 - 10;

              return (
                <g key={`alert-mark-${alt.id}`} style={{ cursor: 'pointer' }} onClick={() => setActiveTab('alerts')}>
                  <circle cx={ax} cy={ay} r="14" fill="rgba(239, 68, 68, 0.25)" className="pulse-indicator" />
                  <circle cx={ax} cy={ay} r="8" fill="#ef4444" stroke="#fff" strokeWidth="1.5" />
                  <text x={ax} y={ay + 3} textAnchor="middle" fill="#fff" fontSize="9" fontWeight="900">
                    !
                  </text>
                </g>
              );
            })}

          {/* Worker Markers */}
          {showWorkers &&
            workers.map((w: Worker) => {
              const isCritical = w.status === 'CRITICAL';
              const isWarning = w.status === 'WARNING';
              const isOffline = w.status === 'OFFLINE';

              let dotFill = '#10b981';
              if (isCritical) dotFill = '#ef4444';
              else if (isWarning) dotFill = '#f59e0b';
              else if (isOffline) dotFill = '#64748b';

              return (
                <g
                  key={`wrk-mark-${w.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedWorker(w);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {isCritical && (
                    <circle cx={w.coordinates.x} cy={w.coordinates.y} r="12" fill="rgba(239, 68, 68, 0.3)" />
                  )}
                  <circle
                    cx={w.coordinates.x}
                    cy={w.coordinates.y}
                    r="6"
                    fill={dotFill}
                    stroke="#0b1120"
                    strokeWidth="1.5"
                  />
                  <text
                    x={w.coordinates.x + 8}
                    y={w.coordinates.y + 3}
                    fill="#f1f5f9"
                    fontSize="9"
                    fontWeight="700"
                    fontFamily="var(--font-mono)"
                  >
                    {w.id}
                  </text>
                </g>
              );
            })}
        </svg>

        {/* Popover details when an entity is selected */}
        {selectedMapZone && (
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              boxShadow: 'var(--shadow-card)',
              width: '260px',
              zIndex: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <strong style={{ color: 'var(--text-primary)', fontSize: '13px' }}>{selectedMapZone.name}</strong>
              <button
                onClick={() => setSelectedMapZone(null)}
                style={{ fontSize: '11px', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.3 }}>
              {selectedMapZone.description}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              <div>Depth: -{selectedMapZone.depthMeters}m</div>
              <div>Airflow: {selectedMapZone.airflowVelocity} m/s</div>
              <div>Methane: {selectedMapZone.gasMethanePpm} ppm</div>
              <div>Workers: {selectedMapZone.workerCount} Pers</div>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div
        style={{
          padding: '10px 18px',
          backgroundColor: 'var(--bg-card-inner)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '11px',
          color: 'var(--text-secondary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--safety-green)' }} />
            <span>Worker (Safe)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--warning-amber)' }} />
            <span>Worker (Warning)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--danger-red)' }} />
            <span>Critical / SOS</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--info-cyan)' }} />
            <span>CCTV Camera</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ border: '1px dashed #06b6d4', width: '12px', height: '0px' }} />
            <span>Fresh Airflow Drift</span>
          </div>
        </div>

        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          Click any zone / worker node to inspect telemetry
        </div>
      </div>
    </div>
  );
};
