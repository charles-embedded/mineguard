import React from 'react';
import {
  LayoutDashboard,
  Map,
  Video,
  Activity,
  BrainCircuit,
  AlertTriangle,
  Radio,
  Terminal,
  Settings,
  ShieldAlert,
  Wifi,
  HardHat,
} from 'lucide-react';
import { useMineData } from '../../context/MineDataContext';
import type { NavTab } from '../../types/mine';

interface NavItemConfig {
  id: NavTab;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
  badgeColor?: 'red' | 'amber' | 'blue';
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, alerts, isSimulating, toggleSimulation } = useMineData();

  const activeCriticalAlerts = alerts.filter((a) => a.severity === 'CRITICAL' && a.status === 'ACTIVE').length;
  const activeAlertsCount = alerts.filter((a) => a.status === 'ACTIVE').length;

  const navItems: NavItemConfig[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'workers', label: 'Workers', icon: <HardHat size={18} />, badge: '24' },
    { id: 'mine-map', label: 'Mine Map', icon: <Map size={18} /> },
    { id: 'cctv-zones', label: 'CCTV / Zones', icon: <Video size={18} />, badge: '6/6' },
    { id: 'sensors', label: 'Sensors', icon: <Activity size={18} /> },
    { id: 'ai-safety', label: 'AI Safety', icon: <BrainCircuit size={18} />, badge: 'AI-3', badgeColor: 'blue' },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: <AlertTriangle size={18} />,
      badge: activeAlertsCount > 0 ? activeAlertsCount : undefined,
      badgeColor: activeCriticalAlerts > 0 ? 'red' : 'amber',
    },
    { id: 'devices', label: 'Devices', icon: <Radio size={18} /> },
    { id: 'system-logs', label: 'System Logs', icon: <Terminal size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <aside
      style={{
        width: '260px',
        minWidth: '260px',
        height: '100vh',
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        zIndex: 20,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '20px 18px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #ff7700 0%, #b45309 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 14px rgba(255, 119, 0, 0.4)',
            flexShrink: 0,
          }}
        >
          <ShieldAlert size={22} strokeWidth={2.4} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontSize: '17px',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-sans)',
              }}
            >
              MINEGUARD
            </span>
            <span
              style={{
                fontSize: '9px',
                fontFamily: 'var(--font-mono)',
                backgroundColor: 'rgba(255, 119, 0, 0.2)',
                color: 'var(--industrial-gold)',
                padding: '1px 5px',
                borderRadius: '3px',
                fontWeight: 700,
              }}
            >
              v2.4
            </span>
          </div>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: 'var(--text-muted)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              display: 'block',
              marginTop: '1px',
            }}
          >
            INTELLIGENT MINE SAFETY
          </span>
        </div>
      </div>

      {/* System Status Pill */}
      <div
        style={{
          margin: '12px 14px 6px',
          padding: '8px 12px',
          backgroundColor: 'var(--bg-card-inner)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--safety-green)',
              boxShadow: '0 0 8px var(--safety-green)',
              display: 'inline-block',
            }}
          />
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>
              SYSTEM ONLINE
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              LoRa: 868.10 MHz
            </div>
          </div>
        </div>

        <button
          onClick={toggleSimulation}
          title={isSimulating ? 'Pause live telemetry simulation' : 'Resume live telemetry simulation'}
          style={{
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            padding: '2px 6px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: isSimulating ? 'var(--safety-green-bg)' : 'rgba(100, 116, 139, 0.2)',
            color: isSimulating ? 'var(--safety-green)' : 'var(--text-muted)',
            border: `1px solid ${isSimulating ? 'var(--safety-green-border)' : 'transparent'}`,
            fontWeight: 700,
          }}
        >
          {isSimulating ? 'LIVE' : 'PAUSED'}
        </button>
      </div>

      {/* Navigation List */}
      <nav
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
        }}
      >
        <div
          style={{
            fontSize: '10px',
            fontWeight: 700,
            color: 'var(--text-muted)',
            padding: '6px 10px 4px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Operations Menu
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          let badgeBg = 'rgba(100, 116, 139, 0.2)';
          let badgeText = 'var(--text-secondary)';

          if (item.badgeColor === 'red') {
            badgeBg = 'var(--danger-red-bg)';
            badgeText = 'var(--danger-red)';
          } else if (item.badgeColor === 'amber') {
            badgeBg = 'var(--warning-amber-bg)';
            badgeText = 'var(--warning-amber)';
          } else if (item.badgeColor === 'blue') {
            badgeBg = 'var(--info-cyan-bg)';
            badgeText = 'var(--info-cyan)';
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                border: `1px solid ${isActive ? 'rgba(59, 130, 246, 0.35)' : 'transparent'}`,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '13px',
                transition: 'all 0.12s ease',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    color: isActive ? 'var(--info-cyan)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: badgeBg,
                    color: badgeText,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Operator & System Health Footer */}
      <div
        style={{
          padding: '14px 16px',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-card-inner)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--info-cyan)',
                fontWeight: 700,
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              EA
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Eng. Admin
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                Base Station Controller
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: 'var(--safety-green)',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <Wifi size={12} />
            <span>14ms</span>
          </div>
        </div>

        <div
          style={{
            fontSize: '10px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>GW: SX1302-CH8</span>
          <span>MQTT: 1883</span>
        </div>
      </div>
    </aside>
  );
};
