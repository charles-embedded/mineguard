import React, { useState } from 'react';
import {
  Radio,
  Wifi,
  BatteryCharging,
  Cpu,
  Search,
  HardHat,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { useMineData } from '../context/MineDataContext';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import type { DeviceNode, MineZone } from '../types/mine';

export const DevicesPage: React.FC = () => {
  const { devices, zones } = useMineData();
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  const filteredDevices = devices.filter((d: DeviceNode) => {
    if (typeFilter !== 'ALL' && d.type !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const zoneObj = zones.find((z: MineZone) => z.id === d.zone);
      const zoneName = zoneObj ? zoneObj.name.toLowerCase() : '';
      return (
        d.id.toLowerCase().includes(q) ||
        d.model.toLowerCase().includes(q) ||
        zoneName.includes(q) ||
        (d.assignedTo && d.assignedTo.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const onlineNodes = devices.filter((d: DeviceNode) => d.status === 'ONLINE').length;
  const esp32Count = devices.filter((d: DeviceNode) => d.type === 'ESP32_BADGE').length;
  const loraCount = devices.filter((d: DeviceNode) => d.type === 'LORA_GATEWAY').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Device Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        <MetricCard
          title="Hardware Nodes Online"
          value={`${onlineNodes} / ${devices.length}`}
          subtext="ESP32, Repeaters & Gateways"
          icon={<CheckCircle2 size={20} />}
          variant="green"
          badgeText="96% Uptime"
        />

        <MetricCard
          title="ESP32 Wearable Nodes"
          value={esp32Count}
          subtext="Helmet IoT Biometric Modules"
          icon={<HardHat size={20} />}
          variant="blue"
          badgeText="Active Shift"
        />

        <MetricCard
          title="LoRa RF Gateways"
          value={loraCount}
          subtext="868 MHz Subsurface Mesh"
          icon={<Radio size={20} />}
          variant="amber"
          badgeText="Ch-8 Config"
        />

        <MetricCard
          title="SX1302 Base Gateway"
          value="CH-8 ACTIVE"
          subtext="Central Shaft #4 Ingress"
          icon={<Cpu size={20} />}
          variant="neutral"
          badgeText="14ms Latency"
        />
      </div>

      {/* Device Inventory Table Card */}
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
        {/* Toolbar */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                color: 'var(--info-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Radio size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Hardware Fleet & LoRa Infrastructure Inventory
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                ESP32 worker sensor nodes, stationary pods, repeaters & gateways
              </p>
            </div>
          </div>

          {/* Filter & Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                placeholder="Search device..."
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

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '11px',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                outline: 'none',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <option value="ALL">Device Type: All</option>
              <option value="ESP32_BADGE">ESP32 Badge</option>
              <option value="ENVIRONMENTAL_POD">Environmental Pod</option>
              <option value="LORA_GATEWAY">LoRa Gateway</option>
              <option value="AI_EDGE_BOX">AI Edge Box</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="industrial-table">
            <thead>
              <tr>
                <th>Node ID</th>
                <th>Hardware Model</th>
                <th>Type</th>
                <th>Subsurface Zone</th>
                <th>Assignment</th>
                <th>Signal (RSSI)</th>
                <th>Battery</th>
                <th>Packet Success</th>
                <th>Firmware</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.map((dev: DeviceNode) => {
                const targetZone = zones.find((z: MineZone) => z.id === dev.zone);

                return (
                  <tr key={dev.id}>
                    <td className="mono" style={{ fontWeight: 700, color: 'var(--info-cyan)' }}>
                      {dev.id}
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{dev.model}</div>
                    </td>

                    <td>
                      <span
                        className="mono"
                        style={{
                          fontSize: '11px',
                          backgroundColor: 'var(--bg-card-inner)',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {dev.type}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                        <MapPin size={12} style={{ color: 'var(--info-cyan)' }} />
                        <span>{targetZone ? targetZone.name : dev.zone}</span>
                      </div>
                      {targetZone && (
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                          -{targetZone.depthMeters}m level
                        </div>
                      )}
                    </td>

                    <td>
                      {dev.assignedTo ? (
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '12px' }}>
                            {dev.assignedTo}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Sector Fixed Mount</span>
                      )}
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Wifi size={13} style={{ color: dev.signalStrengthRssi > -75 ? 'var(--safety-green)' : 'var(--warning-amber)' }} />
                        <span className="mono" style={{ fontSize: '12px', fontWeight: 600 }}>
                          {dev.signalStrengthRssi} dBm
                        </span>
                      </div>
                    </td>

                    <td>
                      {dev.batteryLevel !== undefined ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <BatteryCharging
                            size={14}
                            style={{
                              color: dev.batteryLevel > 40 ? 'var(--safety-green)' : 'var(--warning-amber)',
                            }}
                          />
                          <span className="mono" style={{ fontSize: '12px' }}>{dev.batteryLevel}%</span>
                        </div>
                      ) : (
                        <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>AC Mains (24V)</span>
                      )}
                    </td>

                    <td className="mono" style={{ fontSize: '11px', color: 'var(--safety-green)', fontWeight: 600 }}>
                      {dev.packetSuccessRate}%
                    </td>

                    <td className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {dev.firmwareVersion}
                    </td>

                    <td>
                      <StatusBadge status={dev.status} size="sm" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
