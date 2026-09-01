import React, { useState } from 'react';
import {
  Terminal,
  Search,
  Filter,
  Copy,
  Check,
} from 'lucide-react';
import { useMineData } from '../context/MineDataContext';
import type { SystemLog } from '../types/mine';

export const SystemLogsPage: React.FC = () => {
  const { logs, isSimulating } = useMineData();
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const filteredLogs = logs.filter((log: SystemLog) => {
    if (levelFilter !== 'ALL' && log.level !== levelFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        log.message.toLowerCase().includes(q) ||
        log.topic.toLowerCase().includes(q) ||
        log.source.toLowerCase().includes(q) ||
        log.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopy = () => {
    const text = filteredLogs.map((l: SystemLog) => `[${l.timestamp}] [${l.level}] [${l.topic}] (${l.source}) ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Terminal Card */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* Terminal Header */}
        <div
          style={{
            padding: '12px 18px',
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
              <Terminal size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Subsurface MQTT Telemetry Packet Stream & Event Log
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Ingress stream from SX1302 LoRa gateway & edge vision services
              </p>
            </div>
          </div>

          {/* Controls */}
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
                placeholder="Filter topic / message..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '11px',
                  width: '140px',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={12} style={{ color: 'var(--text-muted)' }} />
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
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
                <option value="ALL">Level: All</option>
                <option value="INFO">INFO</option>
                <option value="WARN">WARN</option>
                <option value="ERROR">ERROR</option>
                <option value="DEBUG">DEBUG</option>
              </select>
            </div>

            <button
              onClick={handleCopy}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              {copied ? <Check size={12} style={{ color: 'var(--safety-green)' }} /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Terminal Content Screen */}
        <div
          className="terminal-feed"
          style={{
            minHeight: '480px',
            maxHeight: '620px',
            overflowY: 'auto',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          {filteredLogs.map((log: SystemLog) => {
            let levelColor = '#38bdf8';
            if (log.level === 'WARN') levelColor = '#fbbf24';
            else if (log.level === 'ERROR') levelColor = '#f87171';
            else if (log.level === 'DEBUG') levelColor = '#94a3b8';

            return (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  fontSize: '11px',
                  lineHeight: 1.4,
                  wordBreak: 'break-all',
                }}
              >
                {/* Timestamp */}
                <span style={{ color: '#64748b', flexShrink: 0 }}>
                  [{log.timestamp}]
                </span>

                {/* Level Pill */}
                <span
                  style={{
                    color: levelColor,
                    fontWeight: 700,
                    minWidth: '46px',
                    flexShrink: 0,
                  }}
                >
                  [{log.level}]
                </span>

                {/* Topic */}
                <span style={{ color: '#06b6d4', flexShrink: 0 }}>
                  {log.topic}
                </span>

                {/* Source */}
                <span style={{ color: '#94a3b8', flexShrink: 0 }}>
                  ({log.source}):
                </span>

                {/* Message */}
                <span style={{ color: '#e2e8f0' }}>
                  {log.message}
                </span>
              </div>
            );
          })}
        </div>

        {/* Status Bar */}
        <div
          style={{
            padding: '8px 16px',
            backgroundColor: 'var(--bg-card-inner)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
          }}
        >
          <span>Broker: tcp://127.0.0.1:1883 • QoS: 1 • ClientID: mineguard_basestation_01</span>
          <span style={{ color: isSimulating ? 'var(--safety-green)' : 'var(--text-muted)' }}>
            ● Stream: {isSimulating ? 'Connected (Receiving)' : 'Paused'}
          </span>
        </div>
      </div>
    </div>
  );
};
