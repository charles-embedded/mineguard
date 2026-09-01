import React from 'react';
import {
  BrainCircuit,
  Cpu,
  Camera,
  Sparkles,
  AlertTriangle,
  UserX,
  ShieldAlert,
  Activity,
} from 'lucide-react';
import { useMineData } from '../context/MineDataContext';
import { MetricCard } from '../components/common/MetricCard';
import { AISafetyFeed } from '../components/dashboard/AISafetyFeed';

export const AISafetyPage: React.FC = () => {
  const { aiEvents } = useMineData();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* AI Model Architecture & Inference Metrics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
        }}
      >
        <MetricCard
          title="Active AI Safety Events"
          value={aiEvents.length}
          subtext="2 Critical • 1 Warning • 1 Info"
          icon={<BrainCircuit size={20} />}
          variant="red"
          badgeText="Active Triggers"
        />

        <MetricCard
          title="Vision Inference Latency"
          value="42 ms"
          subtext="Jetson Orin Nano Edge Hub"
          icon={<Cpu size={20} />}
          variant="blue"
          badgeText="Edge Box #1"
        />

        <MetricCard
          title="Model Average Confidence"
          value="93.2%"
          subtext="YOLOv8 + Wearable IMU Fusion"
          icon={<Sparkles size={20} />}
          variant="green"
          badgeText="High Precision"
        />

        <MetricCard
          title="Optical Streams Analyzed"
          value="6 / 6"
          subtext="Zone A through Zone F"
          icon={<Camera size={20} />}
          variant="neutral"
          badgeText="Real-time"
        />
      </div>

      {/* Engineering AI Architecture Note Box */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            color: 'var(--info-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <BrainCircuit size={22} />
        </div>

        <div>
          <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
            MINEGUARD Multi-Sensor AI Event Detection Engine
          </h4>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
            Combines edge CCTV vision bounding boxes with wearable 6-axis IMU acceleration data and atmospheric multi-gas levels to classify high-risk events (e.g. <em>Worker immobility detection</em>, <em>Potential casualty event</em>, and <em>Restricted-zone entry</em>).
          </p>
        </div>
      </div>

      {/* AI Safety Event Feed */}
      <AISafetyFeed />

      {/* AI Detection Criteria Matrix */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '14px 18px',
            backgroundColor: 'var(--bg-card-inner)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
            AI Safety Event Classification Criteria
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Engineering rulesets configured on Edge AI Vision Hub
          </p>
        </div>

        <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          <div
            style={{
              backgroundColor: 'var(--bg-card-inner)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <UserX size={16} style={{ color: 'var(--danger-red)' }} />
              <strong style={{ color: 'var(--text-primary)', fontSize: '13px' }}>Worker Immobility Detection</strong>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Triggered when wearable IMU indicates zero positional acceleration for &gt; 120 seconds, corroborated by stationary human bounding box in camera feed.
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'var(--bg-card-inner)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <ShieldAlert size={16} style={{ color: 'var(--danger-red)' }} />
              <strong style={{ color: 'var(--text-primary)', fontSize: '13px' }}>Potential Casualty Event</strong>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Triggered when fall trajectory detection correlates with sudden bradycardia / heart rate depression and toxic atmospheric gas excursions.
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'var(--bg-card-inner)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <AlertTriangle size={16} style={{ color: 'var(--warning-amber)' }} />
              <strong style={{ color: 'var(--text-primary)', fontSize: '13px' }}>Restricted-Zone Entry</strong>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Triggered when human bounding box intersects calibrated hazard polygonal geofences (e.g. High-Voltage Substation or Explosives Vault).
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'var(--bg-card-inner)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Activity size={16} style={{ color: 'var(--info-cyan)' }} />
              <strong style={{ color: 'var(--text-primary)', fontSize: '13px' }}>Prolonged Inactivity Detection</strong>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Flags stationary personnel remaining at transfer chutes or haulage corridors for &gt; 25 minutes to prevent operator fatigue incidents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
