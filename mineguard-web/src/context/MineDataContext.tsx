import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {
  Worker,
  MineZone,
  SafetyAlert,
  AISafetyEvent,
  SensorCategoryStatus,
  DeviceNode,
  SystemLog,
  StationSettings,
  NavTab,
  ZoneId,
} from '../types/mine';

import {
  INITIAL_WORKERS,
  INITIAL_ZONES,
  INITIAL_ALERTS,
  INITIAL_AI_EVENTS,
  INITIAL_SENSOR_CATEGORIES,
  INITIAL_DEVICES,
  INITIAL_SYSTEM_LOGS,
  INITIAL_SETTINGS,
} from '../data/mockData';

const API_BASE_URL = 'http://127.0.0.1:8000';

export interface MineDataContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  workers: Worker[];
  zones: MineZone[];
  alerts: SafetyAlert[];
  aiEvents: AISafetyEvent[];
  sensorCategories: SensorCategoryStatus[];
  devices: DeviceNode[];
  logs: SystemLog[];
  settings: StationSettings;
  selectedWorker: Worker | null;
  setSelectedWorker: (worker: Worker | null) => void;
  selectedZone: MineZone | null;
  setSelectedZone: (zone: MineZone | null) => void;
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  triggerEmergencyBroadcast: (zoneId?: ZoneId) => void;
  updateSettings: (newSettings: Partial<StationSettings>) => void;
  toggleSimulation: () => void;
  isSimulating: boolean;
  lastUpdated: Date;
}

export const MineDataContext = createContext<MineDataContextType | undefined>(
  undefined
);

export const MineDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');

  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
 const [zones] = useState<MineZone[]>(INITIAL_ZONES);
  const [alerts, setAlerts] = useState<SafetyAlert[]>(INITIAL_ALERTS);

  const [aiEvents] = useState<AISafetyEvent[]>(INITIAL_AI_EVENTS);
  const [sensorCategories] = useState<SensorCategoryStatus[]>(
    INITIAL_SENSOR_CATEGORIES
  );
  const [devices] = useState<DeviceNode[]>(INITIAL_DEVICES);
  const [logs, setLogs] = useState<SystemLog[]>(INITIAL_SYSTEM_LOGS);

  const [settings, setSettings] =
    useState<StationSettings>(INITIAL_SETTINGS);

  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [selectedZone, setSelectedZone] = useState<MineZone | null>(null);

  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  /*
   * Convert API worker telemetry into the Worker format
   * already used by the MineGuard UI.
   */
  const convertWorkerData = (data: any): Worker => {
    const existingWorker = INITIAL_WORKERS.find(
      (worker) => worker.id === data.worker_id
    );

    return {
      ...(existingWorker || INITIAL_WORKERS[0]),
      id: data.worker_id,
      name: data.name,
      zone: data.zone,
      status: data.motion_detected ? 'SAFE' : 'WARNING',

      vitals: {
        ...(existingWorker?.vitals || INITIAL_WORKERS[0].vitals),
        heartRate: data.heart_rate_bpm,
        bodyTemp: data.temperature_c,
        gasLevel: data.gas_mq4_ppm,
        battery: data.battery_percent,
        lastPacketTime: 'Just now',
      },
    };
  };

  /*
   * Fetch live worker telemetry from FastAPI.
   */
  const fetchWorkers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/workers`);

      if (!response.ok) {
        throw new Error(`Workers API error: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const convertedWorkers = data.map(convertWorkerData);
        setWorkers(convertedWorkers);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch workers:', error);

      // Keep existing/mock data as fallback.
    }
  };

  /*
   * Fetch live safety alerts from FastAPI.
   */
  const fetchAlerts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/alerts`);

      if (!response.ok) {
        throw new Error(`Alerts API error: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        const convertedAlerts: SafetyAlert[] = data.map((alert: any) => ({
          id: String(alert.id),
          timestamp: new Date(alert.timestamp).toLocaleTimeString(),
          severity: alert.severity,
          status: alert.acknowledged ? 'ACKNOWLEDGED' : 'ACTIVE',
          category: 'BIOMETRIC',
          zone: alert.zone,
          zoneName: alert.zone,
          title: alert.alert_type,
          description: alert.message,
        }));

        setAlerts(convertedAlerts);
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error);

      // Keep existing/mock data as fallback.
    }
  };

  /*
   * Fetch live system statistics.
   */
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats`);

      if (!response.ok) {
        throw new Error(`Stats API error: ${response.status}`);
      }

      const data = await response.json();

      console.log('MineGuard API stats:', data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);

      // Keep existing/mock data as fallback.
    }
  };

  /*
   * Load live data immediately and refresh every 3 seconds.
   */
  useEffect(() => {
    const loadLiveData = async () => {
      await Promise.all([
        fetchWorkers(),
        fetchAlerts(),
        fetchStats(),
      ]);
    };

    loadLiveData();

    const interval = setInterval(loadLiveData, 3000);

    return () => clearInterval(interval);
  }, []);

  const acknowledgeAlert = (alertId: string) => {
    const nowStr = new Date().toLocaleTimeString();

    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: 'ACKNOWLEDGED',
              acknowledgedBy: 'Eng. Admin',
              acknowledgedAt: nowStr,
            }
          : a
      )
    );

    const newLog: SystemLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: nowStr,
      level: 'INFO',
      topic: 'mineguard/alert/ack',
      source: 'BaseStation-Operator',
      message: `Alert ${alertId} acknowledged by operator Eng. Admin`,
    };

    setLogs((prev) => [newLog, ...prev]);
  };

  const resolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: 'RESOLVED',
            }
          : a
      )
    );
  };

  const triggerEmergencyBroadcast = (zoneId?: ZoneId) => {
    const target = zoneId ? `ZONE: ${zoneId}` : 'ALL SECTORS';

    const newAlert: SafetyAlert = {
      id: `ALT-EMERG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString(),
      severity: 'CRITICAL',
      status: 'ACTIVE',
      category: 'COMMUNICATION',
      zone: zoneId || 'ZONE_B',
      zoneName: zoneId
        ? zones.find((z) => z.id === zoneId)?.name || 'Target Zone'
        : 'All Subsurface Sectors',
      title: 'EMERGENCY EVACUATION BROADCAST TRIGGERED',
      description: `Manual base station alarm broadcast dispatched to ${target}. Acoustic sirens and strobe beacons engaged.`,
    };

    setAlerts((prev) => [newAlert, ...prev]);

    const newLog: SystemLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString(),
      level: 'ERROR',
      topic: 'mineguard/broadcast/emergency',
      source: 'BaseStation-Admin',
      message: `EMERGENCY SIREN BROADCAST DISPATCHED TO ${target} VIA LORA REPEATERS.`,
    };

    setLogs((prev) => [newLog, ...prev]);
  };

  const updateSettings = (newSettings: Partial<StationSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
      thresholds: {
        ...prev.thresholds,
        ...(newSettings.thresholds || {}),
      },
    }));
  };

  const toggleSimulation = () => {
    setIsSimulating((prev) => !prev);
  };

  return (
    <MineDataContext.Provider
      value={{
        activeTab,
        setActiveTab,
        workers,
        zones,
        alerts,
        aiEvents,
        sensorCategories,
        devices,
        logs,
        settings,
        selectedWorker,
        setSelectedWorker,
        selectedZone,
        setSelectedZone,
        acknowledgeAlert,
        resolveAlert,
        triggerEmergencyBroadcast,
        updateSettings,
        toggleSimulation,
        isSimulating,
        lastUpdated,
      }}
    >
      {children}
    </MineDataContext.Provider>
  );
};

export { useMineData } from './useMineData';