export type WorkerStatus = 'SAFE' | 'WARNING' | 'CRITICAL' | 'OFFLINE';

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO' | 'RESOLVED';

export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'RESOLVED';

export type ZoneId = 'ZONE_A' | 'ZONE_B' | 'ZONE_C' | 'ZONE_D' | 'ZONE_E' | 'ZONE_F';

export type NavTab = 
  | 'overview' 
  | 'workers' 
  | 'mine-map' 
  | 'cctv-zones' 
  | 'sensors' 
  | 'ai-safety' 
  | 'alerts' 
  | 'devices' 
  | 'system-logs' 
  | 'settings';

export interface WorkerVitals {
  heartRate: number; // bpm
  bodyTemp: number; // °C
  gasLevel: number; // ppm (Methane / CO composite index)
  battery: number; // %
  motionState: 'NORMAL' | 'LOW_ACTIVITY' | 'IMMOBILE' | 'FALL_SUSPECTED';
  immobilityDurationSec?: number;
  lastPacketTime: string;
  rssi: number; // dBm
}

export interface Worker {
  id: string; // e.g. "WRK-101"
  name: string;
  role: string;
  zone: ZoneId;
  zoneName: string;
  status: WorkerStatus;
  vitals: WorkerVitals;
  nodeId: string; // ESP32 badge ID
  emergencySos: boolean;
  assignedEquipment: string[];
  coordinates: { x: number; y: number; level: number }; // For visual mine map
}

export interface MineZone {
  id: ZoneId;
  code: string;
  name: string;
  description: string;
  depthMeters: number;
  workerCount: number;
  safetyStatus: 'NORMAL' | 'ELEVATED' | 'HAZARD';
  cctvStatus: 'ONLINE' | 'STANDBY' | 'DEGRADED' | 'OFFLINE';
  cctvCameraId: string;
  aiMonitoringStatus: 'ACTIVE' | 'CALIBRATING' | 'ALERT_TRIGGERED';
  gasMethanePpm: number;
  gasCarbonMonoxidePpm: number;
  ambientTemp: number; // °C
  humidity: number; // %
  airflowVelocity: number; // m/s
  mapCoordinates: { x: number; y: number; width: number; height: number };
}

export interface SafetyAlert {
  id: string;
  timestamp: string;
  severity: AlertSeverity;
  status: AlertStatus;
  category: 'GAS' | 'IMMOBILITY' | 'TEMPERATURE' | 'COMMUNICATION' | 'ZONE_BREACH' | 'BIOMETRIC';
  zone: ZoneId;
  zoneName: string;
  workerId?: string;
  workerName?: string;
  title: string;
  description: string;
  telemetryValue?: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface AISafetyEvent {
  id: string;
  timestamp: string;
  eventType: 
    | 'WORKER_IMMOBILITY'
    | 'POTENTIAL_CASUALTY'
    | 'RESTRICTED_ZONE_ENTRY'
    | 'CROWD_DETECTED'
    | 'PROLONGED_INACTIVITY'
    | 'PPE_ANOMALY';
  title: string;
  zone: ZoneId;
  zoneName: string;
  cameraId: string;
  confidenceScore: number; // 0 - 100%
  description: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  status: 'ACTIVE' | 'VERIFIED' | 'DISMISSED';
  detectedWorkers?: string[];
  boundingBox?: { x: number; y: number; width: number; height: number; label: string };
}

export interface SensorCategoryStatus {
  category: string;
  type: 'GAS' | 'TEMPERATURE' | 'HUMIDITY' | 'HEART_RATE' | 'MOTION' | 'BATTERY' | 'LOCATION';
  total: number;
  online: number;
  warning: number;
  unit: string;
  averageValue: string;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
}

export interface DeviceNode {
  id: string;
  type: 'ESP32_BADGE' | 'LORA_GATEWAY' | 'ENVIRONMENTAL_POD' | 'AI_EDGE_BOX';
  model: string;
  zone: ZoneId;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  firmwareVersion: string;
  batteryLevel?: number; // %
  signalStrengthRssi: number; // dBm
  lastHeartbeat: string;
  packetSuccessRate: number; // %
  assignedTo?: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  topic: string; // e.g. "mineguard/node/WRK-104/telemetry"
  source: string; // e.g. "LoRa-Gateway-01", "MQTT-Broker", "AI-Vision-Engine"
  message: string;
  payload?: Record<string, unknown>;
}

export interface StationSettings {
  siteName: string;
  shaftName: string;
  loraFrequency: string; // e.g. "868.1 MHz"
  loraBandwidth: string; // e.g. "125 kHz"
  loraSpreadingFactor: string; // e.g. "SF7"
  mqttBrokerHost: string;
  mqttBrokerPort: number;
  mqttTopicPrefix: string;
  thresholds: {
    gasMethaneMaxPpm: number;
    gasCoMaxPpm: number;
    ambientTempMaxC: number;
    workerHeartRateMinBpm: number;
    workerHeartRateMaxBpm: number;
    workerImmobilityTimeoutSec: number;
  };
  alarmSoundEnabled: boolean;
  liveSimulationEnabled: boolean;
}
