import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  AlertOctagon,
  ShieldCheck,
} from 'lucide-react';
import { useMineData } from '../context/MineDataContext';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import type { SafetyAlert } from '../types/mine';

export const AlertsPage: React.FC = () => {
  const { alerts, acknowledgeAlert, resolveAlert } = useMineData();
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredAlerts = alerts.filter((a: SafetyAlert) => {
    if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false;
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    return true;
  });

  const criticalCount = alerts.filter((a: SafetyAlert) => a.severity === 'CRITICAL' && a.status === 'ACTIVE').length;
  const warningCount = alerts.filter((a: SafetyAlert) => a.severity === 'WARNING' && a.status === 'ACTIVE').length;
  const resolvedCount = alerts.filter((a: SafetyAlert) => a.status === 'RESOLVED').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Alert Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        <MetricCard
          title="Active Critical Alarms"
          value={criticalCount}
          subtext="Immediate response required"
          icon={<AlertOctagon size={20} />}
          variant="red"
          badgeText="Critical Priority"
        />

        <MetricCard
          title="Active Warnings"
          value={warningCount}
          subtext="Threshold excursions flagged"
          icon={<AlertTriangle size={20} />}
          variant="amber"
          badgeText="Elevated Attention"
        />

        <MetricCard
          title="Resolved Incidents"
          value={resolvedCount}
          subtext="Audited & logged this shift"
          icon={<ShieldCheck size={20} />}
          variant="green"
          badgeText="Cleared"
        />

        <MetricCard
          title="Total Shift Alarms"
          value={alerts.length}
          subtext="Subsurface Event Log"
          icon={<Clock size={20} />}
          variant="neutral"
          badgeText="Shift #4"
        />
      </div>

      {/* Main Alert Table Card */}
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
        {/* Table Toolbar */}
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
                backgroundColor: 'var(--danger-red-bg)',
                color: 'var(--danger-red)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Master Incident Management Matrix
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Safety alarms, telemetry thresholds & operator acknowledgment log
              </p>
            </div>
          </div>

          {/* Filter Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
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
              <option value="ALL">Severity: All</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="WARNING">WARNING</option>
              <option value="INFO">INFO</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>

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
              <option value="ACTIVE">ACTIVE</option>
              <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="industrial-table">
            <thead>
              <tr>
                <th>Alert ID</th>
                <th>Timestamp</th>
                <th>Severity</th>
                <th>Category</th>
                <th>Zone / Sector</th>
                <th>Incident Details</th>
                <th>Telemetry Trigger</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Operator Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No incident records match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alt: SafetyAlert) => {
                  const isCritical = alt.severity === 'CRITICAL';
                  const isActive = alt.status === 'ACTIVE';

                  return (
                    <tr
                      key={alt.id}
                      style={{
                        backgroundColor: isActive && isCritical ? 'rgba(239, 68, 68, 0.05)' : 'transparent',
                      }}
                    >
                      <td className="mono" style={{ fontWeight: 700, color: isCritical ? 'var(--danger-red)' : 'var(--info-cyan)' }}>
                        {alt.id}
                      </td>

                      <td className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {alt.timestamp}
                      </td>

                      <td>
                        <StatusBadge status={alt.severity} size="sm" pulse={isActive && isCritical} />
                      </td>

                      <td>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                          {alt.category}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '12px' }}>
                          {alt.zoneName}
                        </div>
                        {alt.workerName && (
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                            Worker: {alt.workerName} ({alt.workerId})
                          </div>
                        )}
                      </td>

                      <td style={{ maxWidth: '280px', whiteSpace: 'normal' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '12px' }}>
                          {alt.title}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.3 }}>
                          {alt.description}
                        </div>
                        {alt.acknowledgedBy && (
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '3px' }}>
                            Ack: {alt.acknowledgedBy} @ {alt.acknowledgedAt}
                          </div>
                        )}
                      </td>

                      <td>
                        {alt.telemetryValue ? (
                          <span
                            className="mono"
                            style={{
                              fontSize: '11px',
                              backgroundColor: 'var(--bg-card-inner)',
                              padding: '2px 6px',
                              borderRadius: '3px',
                              color: 'var(--industrial-gold)',
                              fontWeight: 600,
                            }}
                          >
                            {alt.telemetryValue}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>--</span>
                        )}
                      </td>

                      <td>
                        <StatusBadge status={alt.status} size="sm" />
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        {isActive && (
                          <button
                            onClick={() => acknowledgeAlert(alt.id)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'rgba(245, 158, 11, 0.15)',
                              border: '1px solid var(--warning-amber-border)',
                              color: 'var(--warning-amber)',
                              fontSize: '11px',
                              fontWeight: 700,
                              fontFamily: 'var(--font-mono)',
                              marginRight: '6px',
                            }}
                          >
                            ACK
                          </button>
                        )}
                        {alt.status !== 'RESOLVED' && (
                          <button
                            onClick={() => resolveAlert(alt.id)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'var(--bg-card-inner)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--safety-green)',
                              fontSize: '11px',
                              fontWeight: 600,
                            }}
                          >
                            Resolve
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
