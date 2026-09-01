import React, { useState } from 'react';
import {
  Sliders,
  Radio,
  Server,
  Save,
  CheckCircle,
} from 'lucide-react';
import { useMineData } from '../context/MineDataContext';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, isSimulating, toggleSimulation } = useMineData();

  const [form, setForm] = useState({
    siteName: settings.siteName,
    shaftName: settings.shaftName,
    loraFrequency: settings.loraFrequency,
    loraBandwidth: settings.loraBandwidth,
    loraSpreadingFactor: settings.loraSpreadingFactor,
    mqttBrokerHost: settings.mqttBrokerHost,
    mqttBrokerPort: settings.mqttBrokerPort,
    mqttTopicPrefix: settings.mqttTopicPrefix,
    gasMethaneMaxPpm: settings.thresholds.gasMethaneMaxPpm,
    gasCoMaxPpm: settings.thresholds.gasCoMaxPpm,
    ambientTempMaxC: settings.thresholds.ambientTempMaxC,
    workerHeartRateMinBpm: settings.thresholds.workerHeartRateMinBpm,
    workerHeartRateMaxBpm: settings.thresholds.workerHeartRateMaxBpm,
    workerImmobilityTimeoutSec: settings.thresholds.workerImmobilityTimeoutSec,
    alarmSoundEnabled: settings.alarmSoundEnabled,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      siteName: form.siteName,
      shaftName: form.shaftName,
      loraFrequency: form.loraFrequency,
      loraBandwidth: form.loraBandwidth,
      loraSpreadingFactor: form.loraSpreadingFactor,
      mqttBrokerHost: form.mqttBrokerHost,
      mqttBrokerPort: form.mqttBrokerPort,
      mqttTopicPrefix: form.mqttTopicPrefix,
      alarmSoundEnabled: form.alarmSoundEnabled,
      thresholds: {
        gasMethaneMaxPpm: Number(form.gasMethaneMaxPpm),
        gasCoMaxPpm: Number(form.gasCoMaxPpm),
        ambientTempMaxC: Number(form.ambientTempMaxC),
        workerHeartRateMinBpm: Number(form.workerHeartRateMinBpm),
        workerHeartRateMaxBpm: Number(form.workerHeartRateMaxBpm),
        workerImmobilityTimeoutSec: Number(form.workerImmobilityTimeoutSec),
      },
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {savedSuccess && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'var(--safety-green-bg)',
            border: '1px solid var(--safety-green-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--safety-green)',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle size={16} />
          Base station telemetry thresholds and RF parameters updated successfully.
        </div>
      )}

      {/* Safety Alert Threshold Configuration */}
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
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Sliders size={16} style={{ color: 'var(--warning-amber)' }} />
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Subsurface Safety & Alarm Thresholds
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Configure automatic hazard alarm dispatch limits
            </p>
          </div>
        </div>

        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
              Methane (CH4) Alarm Ceiling (PPM)
            </label>
            <input
              type="number"
              value={form.gasMethaneMaxPpm}
              onChange={(e) => setForm({ ...form, gasMethaneMaxPpm: Number(e.target.value) })}
              style={{
                width: '100%',
                marginTop: '6px',
                padding: '8px 12px',
                backgroundColor: 'var(--bg-card-inner)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
              Carbon Monoxide (CO) Limit (PPM)
            </label>
            <input
              type="number"
              value={form.gasCoMaxPpm}
              onChange={(e) => setForm({ ...form, gasCoMaxPpm: Number(e.target.value) })}
              style={{
                width: '100%',
                marginTop: '6px',
                padding: '8px 12px',
                backgroundColor: 'var(--bg-card-inner)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
              Max Ambient Temperature (°C)
            </label>
            <input
              type="number"
              step="0.5"
              value={form.ambientTempMaxC}
              onChange={(e) => setForm({ ...form, ambientTempMaxC: Number(e.target.value) })}
              style={{
                width: '100%',
                marginTop: '6px',
                padding: '8px 12px',
                backgroundColor: 'var(--bg-card-inner)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
              Worker Immobility Timeout (Sec)
            </label>
            <input
              type="number"
              value={form.workerImmobilityTimeoutSec}
              onChange={(e) => setForm({ ...form, workerImmobilityTimeoutSec: Number(e.target.value) })}
              style={{
                width: '100%',
                marginTop: '6px',
                padding: '8px 12px',
                backgroundColor: 'var(--bg-card-inner)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
              Min Heart Rate Bradycardia (BPM)
            </label>
            <input
              type="number"
              value={form.workerHeartRateMinBpm}
              onChange={(e) => setForm({ ...form, workerHeartRateMinBpm: Number(e.target.value) })}
              style={{
                width: '100%',
                marginTop: '6px',
                padding: '8px 12px',
                backgroundColor: 'var(--bg-card-inner)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
              Max Heart Rate Tachycardia (BPM)
            </label>
            <input
              type="number"
              value={form.workerHeartRateMaxBpm}
              onChange={(e) => setForm({ ...form, workerHeartRateMaxBpm: Number(e.target.value) })}
              style={{
                width: '100%',
                marginTop: '6px',
                padding: '8px 12px',
                backgroundColor: 'var(--bg-card-inner)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* LoRa Radio & MQTT Configuration */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
        }}
      >
        {/* LoRa Mesh Radio Settings */}
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
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Radio size={16} style={{ color: 'var(--info-cyan)' }} />
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                LoRa SX1302 Concentrator Radio
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Subsurface mesh RF parameters
              </p>
            </div>
          </div>

          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Frequency Channel</label>
              <input
                type="text"
                value={form.loraFrequency}
                onChange={(e) => setForm({ ...form, loraFrequency: e.target.value })}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-card-inner)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Bandwidth</label>
              <input
                type="text"
                value={form.loraBandwidth}
                onChange={(e) => setForm({ ...form, loraBandwidth: e.target.value })}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-card-inner)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Spreading Factor</label>
              <input
                type="text"
                value={form.loraSpreadingFactor}
                onChange={(e) => setForm({ ...form, loraSpreadingFactor: e.target.value })}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-card-inner)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                }}
              />
            </div>
          </div>
        </div>

        {/* MQTT Broker Settings */}
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
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Server size={16} style={{ color: 'var(--safety-green)' }} />
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                MQTT Broker Ingress Settings
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Local EMQX / Mosquitto Broker Connection
              </p>
            </div>
          </div>

          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Broker Hostname</label>
              <input
                type="text"
                value={form.mqttBrokerHost}
                onChange={(e) => setForm({ ...form, mqttBrokerHost: e.target.value })}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-card-inner)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Port</label>
              <input
                type="number"
                value={form.mqttBrokerPort}
                onChange={(e) => setForm({ ...form, mqttBrokerPort: Number(e.target.value) })}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-card-inner)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Topic Namespace</label>
              <input
                type="text"
                value={form.mqttTopicPrefix}
                onChange={(e) => setForm({ ...form, mqttTopicPrefix: e.target.value })}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-card-inner)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
        <button
          type="button"
          onClick={toggleSimulation}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          {isSimulating ? 'Pause Live Telemetry Loop' : 'Resume Live Telemetry Loop'}
        </button>

        <button
          type="submit"
          style={{
            padding: '10px 22px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--border-accent)',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 14px rgba(59, 130, 246, 0.4)',
          }}
        >
          <Save size={16} />
          Save Base Station Settings
        </button>
      </div>
    </form>
  );
};
