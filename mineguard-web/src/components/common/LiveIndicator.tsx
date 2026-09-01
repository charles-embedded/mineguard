import React from 'react';

interface LiveIndicatorProps {
  label?: string;
  status?: 'ONLINE' | 'ACTIVE' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
}

export const LiveIndicator: React.FC<LiveIndicatorProps> = ({ label = 'LIVE STREAM', status = 'ONLINE' }) => {
  let color = 'var(--safety-green)';
  let bg = 'var(--safety-green-bg)';

  if (status === 'WARNING') {
    color = 'var(--warning-amber)';
    bg = 'var(--warning-amber-bg)';
  } else if (status === 'CRITICAL') {
    color = 'var(--danger-red)';
    bg = 'var(--danger-red-bg)';
  } else if (status === 'OFFLINE') {
    color = 'var(--text-muted)';
    bg = 'rgba(100, 116, 139, 0.15)';
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: bg,
        padding: '3px 8px',
        borderRadius: 'var(--radius-sm)',
        border: `1px solid ${color}40`,
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        fontWeight: 700,
        color: color,
        letterSpacing: '0.05em',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}`,
        }}
      />
      {label}
    </div>
  );
};
