import React from 'react';
import {
  Activity,
  Flame,
  Thermometer,
  Droplets,
  Heart,
  Move,
  Battery,
  MapPin,
} from 'lucide-react';
import { useMineData } from '../../context/MineDataContext';
import type { SensorCategoryStatus } from '../../types/mine';

export const SensorCategoryGrid: React.FC = () => {
  const { sensorCategories, setActiveTab } = useMineData();

  const getCategoryIcon = (type: SensorCategoryStatus['type']) => {
    switch (type) {
      case 'GAS':
        return <Flame size={16} style={{ color: 'var(--danger-red)' }} />;
      case 'TEMPERATURE':
        return <Thermometer size={16} style={{ color: 'var(--warning-amber)' }} />;
      case 'HUMIDITY':
        return <Droplets size={16} style={{ color: 'var(--info-cyan)' }} />;
      case 'HEART_RATE':
        return <Heart size={16} style={{ color: 'var(--danger-red)' }} />;
      case 'MOTION':
        return <Move size={16} style={{ color: 'var(--industrial-gold)' }} />;
      case 'BATTERY':
        return <Battery size={16} style={{ color: 'var(--safety-green)' }} />;
      case 'LOCATION':
        return <MapPin size={16} style={{ color: 'var(--info-cyan)' }} />;
      default:
        return <Activity size={16} />;
    }
  };

  const totalSensors = sensorCategories.reduce((acc: number, cat: SensorCategoryStatus) => acc + cat.total, 0);
  const totalOnline = sensorCategories.reduce((acc: number, cat: SensorCategoryStatus) => acc + cat.online, 0);

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
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--safety-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Activity size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Sensor Network Health & Categories
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Subsurface atmospheric, biometric & telemetry mesh nodes
            </p>
          </div>
        </div>

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
          {totalOnline} / {totalSensors} ONLINE
        </span>
      </div>

      {/* Categories Grid */}
      <div
        style={{
          padding: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '12px',
        }}
      >
        {sensorCategories.map((cat: SensorCategoryStatus) => {
          const isWarning = cat.status === 'WARNING';
          const isCritical = cat.status === 'CRITICAL';

          let statusColor = 'var(--safety-green)';
          let statusBg = 'var(--safety-green-bg)';
          let statusBorder = 'var(--safety-green-border)';

          if (isCritical) {
            statusColor = 'var(--danger-red)';
            statusBg = 'var(--danger-red-bg)';
            statusBorder = 'var(--danger-red-border)';
          } else if (isWarning) {
            statusColor = 'var(--warning-amber)';
            statusBg = 'var(--warning-amber-bg)';
            statusBorder = 'var(--warning-amber-border)';
          }

          return (
            <div
              key={cat.type}
              style={{
                backgroundColor: 'var(--bg-card-inner)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-card)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {getCategoryIcon(cat.type)}
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {cat.type}
                  </span>
                </div>

                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    padding: '1px 5px',
                    borderRadius: '2px',
                    backgroundColor: statusBg,
                    color: statusColor,
                    border: `1px solid ${statusBorder}`,
                    fontWeight: 700,
                  }}
                >
                  {cat.online}/{cat.total}
                </span>
              </div>

              <div style={{ marginTop: '2px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{cat.category}</div>
                <div
                  className="mono"
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginTop: '2px',
                  }}
                >
                  {cat.averageValue}
                </div>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  width: '100%',
                  height: '4px',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${(cat.online / cat.total) * 100}%`,
                    height: '100%',
                    backgroundColor: statusColor,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
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
          Atmospheric sampling interval: 2.0s
        </span>
        <button
          onClick={() => setActiveTab('sensors')}
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--info-cyan)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          Sensor Network Telemetry Detail &rarr;
        </button>
      </div>
    </div>
  );
};
