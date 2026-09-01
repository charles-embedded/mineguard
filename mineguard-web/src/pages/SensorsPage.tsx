import React, { useState } from 'react';
import {
  Activity,
  Search,
} from 'lucide-react';
import { useMineData } from '../context/MineDataContext';
import { SensorCategoryGrid } from '../components/dashboard/SensorCategoryGrid';
import { StatusBadge } from '../components/common/StatusBadge';
import type { MineZone, Worker } from '../types/mine';

export const SensorsPage: React.FC = () => {
  const { zones, workers } = useMineData();
  const [tab, setTab] = useState<'stationary' | 'biometric'>('stationary');
  const [search, setSearch] = useState<string>('');

  const filteredZones = zones.filter((z: MineZone) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return z.name.toLowerCase().includes(q) || z.code.toLowerCase().includes(q) || z.cctvCameraId.toLowerCase().includes(q);
  });

  const filteredWorkers = workers.filter((w: Worker) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return w.name.toLowerCase().includes(q) || w.id.toLowerCase().includes(q) || w.nodeId.toLowerCase().includes(q);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Category Overview Grid */}
      <SensorCategoryGrid />

      {/* Detailed Sensor Tables */}
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
        {/* Tab & Toolbar */}
        <div
          style={{
            padding: '14px 18px',
            backgroundColor: 'var(--bg-card-inner)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* Sub-tab selection */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setTab('stationary')}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: tab === 'stationary' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                border: `1px solid ${tab === 'stationary' ? 'var(--info-cyan)' : 'var(--border-subtle)'}`,
                color: tab === 'stationary' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              Stationary Sector Gas & Environment Pods ({zones.length})
            </button>

            <button
              onClick={() => setTab('biometric')}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: tab === 'biometric' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                border: `1px solid ${tab === 'biometric' ? 'var(--info-cyan)' : 'var(--border-subtle)'}`,
                color: tab === 'biometric' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              Wearable Biometric & IMU Telemetry Nodes ({workers.length})
            </button>
          </div>

          {/* Search */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '4px 8px',
            }}
          >
            <Search size={12} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search sensor node..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '11px',
                width: '130px',
              }}
            />
          </div>
        </div>

        {/* Table Content */}
        {tab === 'stationary' ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="industrial-table">
              <thead>
                <tr>
                  <th>Sector</th>
                  <th>Zone Name</th>
                  <th>Depth Level</th>
                  <th>CH4 Gas (PPM)</th>
                  <th>Ambient Temp</th>
                  <th>Humidity</th>
                  <th>Airflow Velocity</th>
                  <th>Safety Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredZones.map((z: MineZone) => (
                  <tr key={z.id}>
                    <td className="mono" style={{ fontWeight: 700, color: 'var(--info-cyan)' }}>
                      {z.code}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{z.name}</div>
                    </td>
                    <td className="mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      -{z.depthMeters}m
                    </td>
                    <td>
                      <span
                        className="mono"
                        style={{
                          fontWeight: 700,
                          color: z.gasMethanePpm > 40 ? 'var(--danger-red)' : 'var(--safety-green)',
                        }}
                      >
                        {z.gasMethanePpm} ppm
                      </span>
                    </td>
                    <td className="mono" style={{ fontWeight: 600 }}>{z.ambientTemp} °C</td>
                    <td className="mono" style={{ color: 'var(--text-secondary)' }}>{z.humidity}%</td>
                    <td className="mono" style={{ color: 'var(--text-secondary)' }}>{z.airflowVelocity} m/s</td>
                    <td>
                      <StatusBadge status={z.safetyStatus} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="industrial-table">
              <thead>
                <tr>
                  <th>Node ID</th>
                  <th>Assigned Personnel</th>
                  <th>Heart Rate (MAX30102)</th>
                  <th>Core Temp</th>
                  <th>Wearable Gas (PPM)</th>
                  <th>IMU Motion State (MPU6050)</th>
                  <th>Battery</th>
                  <th>LoRa RSSI</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkers.map((w: Worker) => (
                  <tr key={w.id}>
                    <td className="mono" style={{ fontWeight: 700, color: 'var(--info-cyan)' }}>
                      {w.nodeId}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{w.name}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{w.role} • {w.zoneName}</div>
                    </td>
                    <td className="mono" style={{ fontWeight: 600 }}>
                      {w.status === 'OFFLINE' ? '--' : `${w.vitals.heartRate} bpm`}
                    </td>
                    <td className="mono" style={{ fontWeight: 600 }}>
                      {w.status === 'OFFLINE' ? '--' : `${w.vitals.bodyTemp} °C`}
                    </td>
                    <td className="mono" style={{ fontWeight: 600, color: w.vitals.gasLevel > 40 ? 'var(--danger-red)' : 'var(--safety-green)' }}>
                      {w.status === 'OFFLINE' ? '--' : `${w.vitals.gasLevel} ppm`}
                    </td>
                    <td className="mono" style={{ fontSize: '11px', color: w.vitals.motionState === 'NORMAL' ? 'var(--safety-green)' : 'var(--danger-red)' }}>
                      {w.vitals.motionState}
                    </td>
                    <td className="mono" style={{ fontSize: '11px' }}>{w.vitals.battery}%</td>
                    <td className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{w.vitals.rssi} dBm</td>
                    <td>
                      <StatusBadge status={w.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            padding: '10px 18px',
            backgroundColor: 'var(--bg-card-inner)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}
        >
          <span>ADC Sampling Rate: 100 Hz (Biometrics) • 1 Hz (Atmospheric)</span>
          <span className="mono" style={{ color: 'var(--safety-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Activity size={12} /> LoRa CRC Checked: 100%
          </span>
        </div>
      </div>
    </div>
  );
};
