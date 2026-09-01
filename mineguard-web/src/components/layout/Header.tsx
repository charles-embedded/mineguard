import React, { useState, useEffect } from 'react';
import {
  Bell,
  Server,
  AlertOctagon,
  Clock,
  Search,
} from 'lucide-react';
import { useMineData } from '../../context/MineDataContext';
import type { SafetyAlert } from '../../types/mine';

interface HeaderProps {
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
}

export const Header: React.FC<HeaderProps> = ({ onSearchChange, searchQuery = '' }) => {
  const { activeTab, setActiveTab, alerts, settings, triggerEmergencyBroadcast } = useMineData();
  const [timeStr, setTimeStr] = useState<string>('');
  const [showConfirmEmergency, setShowConfirmEmergency] = useState<boolean>(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-GB', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeAlerts = alerts.filter((a: SafetyAlert) => a.status === 'ACTIVE');
  const hasCritical = activeAlerts.some((a: SafetyAlert) => a.severity === 'CRITICAL');

  // Friendly title mapping
  const titleMap: Record<string, { title: string; subtitle: string }> = {
    overview: { title: 'Base Station Command Overview', subtitle: 'Real-time telemetry, CCTV matrix & worker safety' },
    workers: { title: 'Underground Worker Roster', subtitle: 'Biometric vitals, wear-status & atmospheric exposure' },
    'mine-map': { title: 'Subsurface Mine Zone Map', subtitle: 'Interactive 2D schematic layout & locator anchors' },
    'cctv-zones': { title: 'CCTV & Zone Surveillance', subtitle: 'Optical HUD feeds with edge AI object detection' },
    sensors: { title: 'Environmental & Biometric Telemetry', subtitle: 'Gas PPM, IMU motion, temperature & LoRa mesh' },
    'ai-safety': { title: 'AI Event & Anomaly Detection', subtitle: 'Automated immobility, casualty risk & perimeter alerts' },
    alerts: { title: 'Safety Alarm & Incident Matrix', subtitle: 'Subsurface threshold violations & emergency dispatch' },
    devices: { title: 'Node & Gateway Hardware Fleet', subtitle: 'ESP32 helmet badges, LoRa repeaters & edge boxes' },
    'system-logs': { title: 'System & MQTT Packet Stream', subtitle: 'Raw telemetry ingress logs & LoRa frames' },
    settings: { title: 'Base Station Configuration', subtitle: 'Safety thresholds, RF parameters & broker setup' },
  };

  const currentInfo = titleMap[activeTab] || { title: 'Base Station', subtitle: 'MINEGUARD System' };

  return (
    <header
      style={{
        height: '68px',
        backgroundColor: 'var(--bg-header)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        userSelect: 'none',
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      {/* Left: Page Title & Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--industrial-gold)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontWeight: 700,
              }}
            >
              {settings.siteName}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>/</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600 }}>
              {settings.shaftName}
            </span>
          </div>

          <h1
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              marginTop: '1px',
            }}
          >
            {currentInfo.title}
          </h1>
        </div>
      </div>

      {/* Center: Search (if available) & Live Digital Clock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {onSearchChange && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--bg-card-inner)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 12px',
              width: '240px',
            }}
          >
            <Search size={14} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search worker / zone / ID..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '12px',
                width: '100%',
                fontFamily: 'var(--font-sans)',
              }}
            />
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--bg-card-inner)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '6px 12px',
          }}
        >
          <Clock size={14} style={{ color: 'var(--info-cyan)' }} />
          <span
            className="mono"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '0.04em',
            }}
          >
            {timeStr || '14:38:22'}
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            UTC+05:30
          </span>
        </div>
      </div>

      {/* Right: Telemetry Badges, Emergency Siren & Notification Bell */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* System Online Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--safety-green-bg)',
            border: '1px solid var(--safety-green-border)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--safety-green)',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--safety-green)',
              boxShadow: '0 0 6px var(--safety-green)',
            }}
          />
          SYSTEM ONLINE
        </div>

        {/* MQTT Connected Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(59, 130, 246, 0.12)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--info-cyan)',
          }}
        >
          <Server size={12} />
          MQTT CONNECTED
        </div>

        {/* Emergency Evacuation Broadcast Button */}
        {showConfirmEmergency ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => {
                triggerEmergencyBroadcast();
                setShowConfirmEmergency(false);
              }}
              style={{
                backgroundColor: 'var(--danger-red)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '11px',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 0 12px rgba(239, 68, 68, 0.6)',
              }}
            >
              <AlertOctagon size={14} />
              CONFIRM SIREN
            </button>
            <button
              onClick={() => setShowConfirmEmergency(false)}
              style={{
                backgroundColor: 'var(--bg-card-hover)',
                color: 'var(--text-secondary)',
                padding: '6px 8px',
                borderRadius: 'var(--radius-md)',
                fontSize: '11px',
                border: '1px solid var(--border-medium)',
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirmEmergency(true)}
            title="Trigger subsurface evacuation acoustic sirens"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--danger-red-bg)',
              border: '1px solid var(--danger-red-border)',
              color: 'var(--danger-red)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--danger-red-bg)';
            }}
          >
            <AlertOctagon size={13} />
            EMERGENCY SIREN
          </button>
        )}

        {/* Alert Notification Bell */}
        <button
          onClick={() => setActiveTab('alerts')}
          style={{
            position: 'relative',
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: hasCritical ? 'var(--danger-red-bg)' : 'var(--bg-card-inner)',
            border: `1px solid ${hasCritical ? 'var(--danger-red-border)' : 'var(--border-subtle)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: hasCritical ? 'var(--danger-red)' : 'var(--text-secondary)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-medium)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = hasCritical ? 'var(--danger-red-border)' : 'var(--border-subtle)';
          }}
        >
          <Bell size={16} />
          {activeAlerts.length > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                minWidth: '16px',
                height: '16px',
                borderRadius: '8px',
                backgroundColor: hasCritical ? 'var(--danger-red)' : 'var(--warning-amber)',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                boxShadow: '0 0 6px rgba(0,0,0,0.5)',
              }}
            >
              {activeAlerts.length}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
