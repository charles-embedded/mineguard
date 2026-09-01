import React from 'react';
import type { WorkerStatus, AlertSeverity, AlertStatus } from '../../types/mine';

interface StatusBadgeProps {
  status:
    | WorkerStatus
    | AlertSeverity
    | AlertStatus
    | 'NORMAL'
    | 'ELEVATED'
    | 'HAZARD'
    | 'ONLINE'
    | 'STANDBY'
    | 'DEGRADED'
    | 'ACTIVE'
    | 'VERIFIED'
    | 'DISMISSED';
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', pulse = false }) => {
  let bg = 'rgba(100, 116, 139, 0.15)';
  let border = 'rgba(100, 116, 139, 0.35)';
  let text = '#94a3b8';
  let dot = '#64748b';

  const normalized = status.toUpperCase();

  if (normalized === 'SAFE' || normalized === 'NORMAL' || normalized === 'ONLINE' || normalized === 'RESOLVED' || normalized === 'HEALTHY' || normalized === 'DISMISSED') {
    bg = 'var(--safety-green-bg)';
    border = 'var(--safety-green-border)';
    text = '#34d399';
    dot = 'var(--safety-green)';
  } else if (normalized === 'WARNING' || normalized === 'ELEVATED' || normalized === 'STANDBY' || normalized === 'ACKNOWLEDGED') {
    bg = 'var(--warning-amber-bg)';
    border = 'var(--warning-amber-border)';
    text = '#fbbf24';
    dot = 'var(--warning-amber)';
  } else if (normalized === 'CRITICAL' || normalized === 'HAZARD' || normalized === 'ACTIVE' || normalized === 'ALERT_TRIGGERED') {
    bg = 'var(--danger-red-bg)';
    border = 'var(--danger-red-border)';
    text = '#f87171';
    dot = 'var(--danger-red)';
  } else if (normalized === 'INFO' || normalized === 'VERIFIED') {
    bg = 'var(--info-cyan-bg)';
    border = 'var(--info-cyan-border)';
    text = '#38bdf8';
    dot = 'var(--info-cyan)';
  } else if (normalized === 'DEGRADED') {
    bg = 'rgba(234, 179, 8, 0.15)';
    border = 'rgba(234, 179, 8, 0.4)';
    text = '#facc15';
    dot = '#eab308';
  }

  const isSmall = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: isSmall ? '2px 7px' : '4px 10px',
        fontSize: isSmall ? '11px' : '12px',
        fontWeight: 600,
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.04em',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: bg,
        border: `1px solid ${border}`,
        color: text,
        lineHeight: 1.2,
      }}
    >
      <span
        style={{
          width: isSmall ? '6px' : '7px',
          height: isSmall ? '6px' : '7px',
          borderRadius: '50%',
          backgroundColor: dot,
          boxShadow: pulse || normalized === 'CRITICAL' ? `0 0 6px ${dot}` : 'none',
          display: 'inline-block',
        }}
      />
      {status}
    </span>
  );
};
