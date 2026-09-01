import React from 'react';
import {
  HardHat,
  Heart,
  Thermometer,
  CloudAlert,
  BatteryCharging,
  Radio,
  MapPin,
  ShieldAlert,
  Volume2,
  PhoneCall,
  Move,
} from 'lucide-react';
import { useMineData } from '../../context/MineDataContext';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';

export const WorkerDetailModal: React.FC = () => {
  const { selectedWorker, setSelectedWorker, triggerEmergencyBroadcast } = useMineData();

  if (!selectedWorker) return null;

  const isOffline = selectedWorker.status === 'OFFLINE';

  return (
    <Modal
      isOpen={!!selectedWorker}
      onClose={() => setSelectedWorker(null)}
      title={`${selectedWorker.name} — [${selectedWorker.id}]`}
      subtitle={`ESP32 IoT Wearable Node: ${selectedWorker.nodeId} • ${selectedWorker.zoneName}`}
      icon={<HardHat size={20} />}
      width="680px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Top Status & SOS Banner if Critical */}
        {selectedWorker.emergencySos && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'var(--danger-red-bg)',
              border: '1px solid var(--danger-red-border)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert size={20} style={{ color: 'var(--danger-red)' }} />
              <div>
                <div style={{ fontWeight: 700, color: 'var(--danger-red)', fontSize: '13px' }}>
                  EMERGENCY SOS SIGNAL ACTIVE
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Triggered by wearable IMU immobility timeout (&gt; 120s) and abnormal vitals.
                </div>
              </div>
            </div>

            <StatusBadge status="CRITICAL" pulse size="sm" />
          </div>
        )}

        {/* Worker Overview Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
            backgroundColor: 'var(--bg-card-inner)',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Role</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
              {selectedWorker.role}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Subsurface Zone</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--info-cyan)', marginTop: '2px' }}>
              {selectedWorker.zoneName}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Safety Status</div>
            <div style={{ marginTop: '2px' }}>
              <StatusBadge status={selectedWorker.status} size="sm" />
            </div>
          </div>

          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Packet Telemetry</div>
            <div className="mono" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
              {selectedWorker.vitals.lastPacketTime}
            </div>
          </div>
        </div>

        {/* 4 Telemetry Gauges Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {/* Heart Rate */}
          <div
            style={{
              backgroundColor: 'var(--bg-card-inner)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Heart size={16} style={{ color: 'var(--danger-red)' }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Heart Rate (MAX30102 PPG)
                </span>
              </div>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Target: 60-100 bpm
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span className="mono" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {isOffline ? '--' : selectedWorker.vitals.heartRate}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>bpm</span>
            </div>

            <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--bg-card)', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.min(100, (selectedWorker.vitals.heartRate / 140) * 100)}%`,
                  height: '100%',
                  backgroundColor: selectedWorker.vitals.heartRate > 115 || selectedWorker.vitals.heartRate < 55 ? 'var(--danger-red)' : 'var(--safety-green)',
                }}
              />
            </div>
          </div>

          {/* Body Temperature */}
          <div
            style={{
              backgroundColor: 'var(--bg-card-inner)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Thermometer size={16} style={{ color: 'var(--warning-amber)' }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Core Body Temperature
                </span>
              </div>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Max: 37.5 °C
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span className="mono" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {isOffline ? '--' : `${selectedWorker.vitals.bodyTemp} °C`}
              </span>
            </div>

            <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--bg-card)', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.min(100, ((selectedWorker.vitals.bodyTemp - 35) / 5) * 100)}%`,
                  height: '100%',
                  backgroundColor: selectedWorker.vitals.bodyTemp > 37.7 ? 'var(--danger-red)' : 'var(--safety-green)',
                }}
              />
            </div>
          </div>

          {/* Ambient Gas Exposure */}
          <div
            style={{
              backgroundColor: 'var(--bg-card-inner)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CloudAlert size={16} style={{ color: 'var(--industrial-gold)' }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Wearable Gas Exposure
                </span>
              </div>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Ceiling: 45 ppm
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span className="mono" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {isOffline ? '--' : `${selectedWorker.vitals.gasLevel} ppm`}
              </span>
            </div>

            <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--bg-card)', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.min(100, (selectedWorker.vitals.gasLevel / 60) * 100)}%`,
                  height: '100%',
                  backgroundColor: selectedWorker.vitals.gasLevel > 45 ? 'var(--danger-red)' : 'var(--safety-green)',
                }}
              />
            </div>
          </div>

          {/* Motion & IMU State */}
          <div
            style={{
              backgroundColor: 'var(--bg-card-inner)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Move size={16} style={{ color: 'var(--info-cyan)' }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  MPU6050 Motion State
                </span>
              </div>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                6-Axis IMU
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span
                className="mono"
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: selectedWorker.vitals.motionState === 'NORMAL' ? 'var(--safety-green)' : 'var(--danger-red)',
                }}
              >
                {selectedWorker.vitals.motionState.replace('_', ' ')}
              </span>
            </div>

            {selectedWorker.vitals.immobilityDurationSec ? (
              <div style={{ fontSize: '11px', color: 'var(--danger-red)', marginTop: '4px' }}>
                Immobility counter: {selectedWorker.vitals.immobilityDurationSec}s elapsed
              </div>
            ) : (
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Continuous micro-acceleration verified
              </div>
            )}
          </div>
        </div>

        {/* Hardware & Comm Metrics */}
        <div
          style={{
            backgroundColor: 'var(--bg-card-inner)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Radio size={14} style={{ color: 'var(--info-cyan)' }} />
            <span>LoRa RSSI: {selectedWorker.vitals.rssi} dBm</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BatteryCharging size={14} style={{ color: 'var(--safety-green)' }} />
            <span>Battery: {selectedWorker.vitals.battery}%</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} style={{ color: 'var(--warning-amber)' }} />
            <span>Level: -{selectedWorker.coordinates.level * 100}m</span>
          </div>
        </div>

        {/* Equipment tags */}
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
            ASSIGNED SAFETY EQUIPMENT
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {selectedWorker.assignedEquipment.map((item, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '11px',
                  backgroundColor: 'var(--bg-card-inner)',
                  border: '1px solid var(--border-subtle)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-secondary)',
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '10px',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '14px',
          }}
        >
          <button
            onClick={() => {
              alert(`Audible helmet buzzer triggered for ${selectedWorker.name} on node ${selectedWorker.nodeId}.`);
            }}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-card-hover)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Volume2 size={14} />
            Sound Helmet Beeper
          </button>

          <button
            onClick={() => {
              triggerEmergencyBroadcast(selectedWorker.zone);
              setSelectedWorker(null);
            }}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--danger-red)',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 10px rgba(239, 68, 68, 0.4)',
            }}
          >
            <PhoneCall size={14} />
            Dispatch Rescue Team
          </button>
        </div>
      </div>
    </Modal>
  );
};
