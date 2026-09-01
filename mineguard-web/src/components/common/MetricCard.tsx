import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  variant?: 'green' | 'amber' | 'red' | 'blue' | 'neutral';
  badgeText?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  icon,
  variant = 'neutral',
  badgeText,
  onClick,
}) => {
  let accentColor = '#3b82f6';
  let accentBg = 'rgba(59, 130, 246, 0.12)';
  let accentBorder = 'var(--border-subtle)';
  let glow = 'none';

  if (variant === 'green') {
    accentColor = 'var(--safety-green)';
    accentBg = 'var(--safety-green-bg)';
    accentBorder = 'var(--safety-green-border)';
    glow = 'var(--shadow-glow-green)';
  } else if (variant === 'amber') {
    accentColor = 'var(--warning-amber)';
    accentBg = 'var(--warning-amber-bg)';
    accentBorder = 'var(--warning-amber-border)';
    glow = 'var(--shadow-glow-amber)';
  } else if (variant === 'red') {
    accentColor = 'var(--danger-red)';
    accentBg = 'var(--danger-red-bg)';
    accentBorder = 'var(--danger-red-border)';
    glow = 'var(--shadow-glow-red)';
  } else if (variant === 'blue') {
    accentColor = 'var(--info-cyan)';
    accentBg = 'var(--info-cyan-bg)';
    accentBorder = 'var(--info-cyan-border)';
    glow = 'var(--shadow-glow-cyan)';
  }

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: `1px solid ${accentBorder}`,
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: variant === 'red' || variant === 'amber' ? glow : 'var(--shadow-card)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
      }}
    >
      {/* Top accent glow line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          backgroundColor: accentColor,
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {title}
        </span>

        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: accentBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accentColor,
          }}
        >
          {icon}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
        <span
          className="mono"
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </span>

        {badgeText && (
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              padding: '2px 6px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: accentBg,
              color: accentColor,
              fontWeight: 600,
            }}
          >
            {badgeText}
          </span>
        )}
      </div>

      {subtext && (
        <span
          style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {subtext}
        </span>
      )}
    </div>
  );
};
