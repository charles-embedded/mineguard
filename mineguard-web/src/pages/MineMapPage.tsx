import React from 'react';
import { InteractiveMineMap } from '../components/map/InteractiveMineMap';
import { useMineData } from '../context/MineDataContext';
import { StatusBadge } from '../components/common/StatusBadge';
import type { MineZone, Worker } from '../types/mine';

export const MineMapPage: React.FC = () => {
  const { zones, workers, selectedZone, setSelectedZone, setSelectedWorker } = useMineData();

  const zoneWorkers = selectedZone
    ? workers.filter((w: Worker) => w.zone === selectedZone.id)
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Interactive Map Component Full Size */}
      <InteractiveMineMap height="560px" />

      {/* Zone Details & Subsurface Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* All Sectors Cards */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px',
          }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>
            Subsurface Mining Zones Overview
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {zones.map((zone: MineZone) => {
              const isSelected = selectedZone?.id === zone.id;
              return (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  style={{
                    padding: '12px 14px',
                    backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-card-inner)',
                    border: `1px solid ${isSelected ? 'var(--info-cyan)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="mono" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>
                        {zone.code}
                      </span>
                      <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{zone.name}</strong>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Depth: -{zone.depthMeters}m • Airflow: {zone.airflowVelocity} m/s • CH4: {zone.gasMethanePpm} ppm
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {zone.workerCount} Workers
                    </span>
                    <StatusBadge status={zone.safetyStatus} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Zone Personnel Inspector */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            {selectedZone ? `${selectedZone.name} Personnel` : 'Select a Zone to Inspect'}
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            {selectedZone ? selectedZone.description : 'Click any sector above or on the map.'}
          </p>

          {selectedZone ? (
            zoneWorkers.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No workers currently stationed in this sector.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '340px' }}>
                {zoneWorkers.map((w: Worker) => (
                  <div
                    key={w.id}
                    onClick={() => setSelectedWorker(w)}
                    style={{
                      padding: '10px 12px',
                      backgroundColor: 'var(--bg-card-inner)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '12px' }}>
                        {w.name} <span className="mono" style={{ fontSize: '11px', color: 'var(--info-cyan)' }}>({w.id})</span>
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        {w.role} • Node: {w.nodeId}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {w.vitals.heartRate} bpm
                      </span>
                      <StatusBadge status={w.status} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Select a zone from the list or map.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
