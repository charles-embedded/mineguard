import React, { useState } from 'react';
import {
  Heart,
  Thermometer,
  CloudAlert,
  BatteryCharging,
  Eye,
  Radio,
  Search,
} from 'lucide-react';
import { useMineData } from '../../context/MineDataContext';
import { StatusBadge } from '../common/StatusBadge';
import type { Worker } from '../../types/mine';

interface WorkerTableProps {
  limit?: number;
  showFilters?: boolean;
}

export const WorkerTable: React.FC<WorkerTableProps> = ({ limit, showFilters = true }) => {
  const { workers, setSelectedWorker, setActiveTab } = useMineData();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [zoneFilter, setZoneFilter] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  const filteredWorkers = workers.filter((worker: Worker) => {
    if (statusFilter !== 'ALL' && worker.status !== statusFilter) return false;
    if (zoneFilter !== 'ALL' && worker.zone !== zoneFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        worker.name.toLowerCase().includes(q) ||
        worker.id.toLowerCase().includes(q) ||
        worker.role.toLowerCase().includes(q) ||
        worker.nodeId.toLowerCase().includes(q) ||
        worker.zoneName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const displayWorkers = limit ? filteredWorkers.slice(0, limit) : filteredWorkers;

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
      {/* Table Card Header */}
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
              Worker Underground Telemetry Roster
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Live LoRa mesh bio-sensors & atmospheric gas exposure
            </p>
          </div>
        </div>

        {/* Filter controls */}
        {showFilters && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
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
                placeholder="Filter worker..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '11px',
                  width: '110px',
                }}
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
              <option value="ALL">Status: All</option>
              <option value="SAFE">SAFE</option>
              <option value="WARNING">WARNING</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="OFFLINE">OFFLINE</option>
            </select>

            {/* Zone Filter */}
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
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
              <option value="ALL">Zone: All</option>
              <option value="ZONE_A">Zone A</option>
              <option value="ZONE_B">Zone B</option>
              <option value="ZONE_C">Zone C</option>
              <option value="ZONE_D">Zone D</option>
              <option value="ZONE_E">Zone E</option>
              <option value="ZONE_F">Zone F</option>
            </select>
          </div>
        )}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', flex: 1 }}>
        <table className="industrial-table">
          <thead>
            <tr>
              <th>Worker ID</th>
              <th>Name / Role</th>
              <th>Zone Location</th>
              <th>Body Temp</th>
              <th>Gas Exposure</th>
              <th>Heart Rate</th>
              <th>Node Battery</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayWorkers.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No personnel records found matching filters.
                </td>
              </tr>
            ) : (
              displayWorkers.map((worker: Worker) => {
                const isCritical = worker.status === 'CRITICAL';
                const isWarning = worker.status === 'WARNING';
                const isOffline = worker.status === 'OFFLINE';

                let tempColor = 'var(--text-primary)';
                if (worker.vitals.bodyTemp > 37.7) tempColor = 'var(--danger-red)';
                else if (worker.vitals.bodyTemp > 37.2) tempColor = 'var(--warning-amber)';

                let gasColor = 'var(--safety-green)';
                if (worker.vitals.gasLevel > 45) gasColor = 'var(--danger-red)';
                else if (worker.vitals.gasLevel > 25) gasColor = 'var(--warning-amber)';

                let hrColor = 'var(--safety-green)';
                if (worker.vitals.heartRate > 115 || (worker.vitals.heartRate < 55 && !isOffline)) {
                  hrColor = 'var(--danger-red)';
                } else if (worker.vitals.heartRate > 95) {
                  hrColor = 'var(--warning-amber)';
                }

                return (
                  <tr
                    key={worker.id}
                    onClick={() => setSelectedWorker(worker)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: isCritical
                        ? 'rgba(239, 68, 68, 0.05)'
                        : isWarning
                        ? 'rgba(245, 158, 11, 0.03)'
                        : 'transparent',
                    }}
                  >
                    {/* Worker ID & SOS indicator */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                          className="mono"
                          style={{
                            fontWeight: 700,
                            color: isCritical ? 'var(--danger-red)' : 'var(--info-cyan)',
                            fontSize: '12px',
                          }}
                        >
                          {worker.id}
                        </span>
                        {worker.emergencySos && (
                          <span
                            style={{
                              fontSize: '9px',
                              backgroundColor: 'var(--danger-red)',
                              color: '#fff',
                              padding: '1px 4px',
                              borderRadius: '2px',
                              fontWeight: 700,
                              fontFamily: 'var(--font-mono)',
                            }}
                          >
                            SOS
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Name & Role */}
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{worker.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{worker.role}</div>
                      </div>
                    </td>

                    {/* Zone */}
                    <td>
                      <div>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: 'var(--text-secondary)',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          {worker.zoneName}
                        </span>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                          Node: {worker.nodeId}
                        </div>
                      </div>
                    </td>

                    {/* Body Temp */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Thermometer size={14} style={{ color: tempColor }} />
                        <span className="mono" style={{ fontWeight: 600, color: tempColor }}>
                          {isOffline ? '--' : `${worker.vitals.bodyTemp} °C`}
                        </span>
                      </div>
                    </td>

                    {/* Gas Exposure */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CloudAlert size={14} style={{ color: gasColor }} />
                        <span className="mono" style={{ fontWeight: 600, color: gasColor }}>
                          {isOffline ? '--' : `${worker.vitals.gasLevel} ppm`}
                        </span>
                      </div>
                    </td>

                    {/* Heart Rate */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Heart size={14} style={{ color: hrColor }} />
                        <span className="mono" style={{ fontWeight: 600, color: hrColor }}>
                          {isOffline ? '--' : `${worker.vitals.heartRate} bpm`}
                        </span>
                      </div>
                    </td>

                    {/* Battery */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <BatteryCharging
                          size={14}
                          style={{
                            color:
                              worker.vitals.battery < 25
                                ? 'var(--danger-red)'
                                : worker.vitals.battery < 50
                                ? 'var(--warning-amber)'
                                : 'var(--safety-green)',
                          }}
                        />
                        <span className="mono" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {worker.vitals.battery}%
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td>
                      <StatusBadge status={worker.status} size="sm" pulse={isCritical} />
                    </td>

                    {/* Action button */}
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedWorker(worker);
                        }}
                        style={{
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--bg-card-hover)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--info-cyan)',
                          fontSize: '11px',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Eye size={12} />
                        Vitals
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination hint */}
      {limit && workers.length > limit && (
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
            Showing {displayWorkers.length} of {workers.length} active personnel
          </span>
          <button
            onClick={() => setActiveTab('workers')}
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--info-cyan)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            View All Workers &rarr;
          </button>
        </div>
      )}
    </div>
  );
};
