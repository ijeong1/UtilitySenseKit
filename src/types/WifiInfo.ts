export interface WifiInfo {
  ssid: string;
  signal: number;
  isProtected: boolean;
  frequency?: number;
  channel?: number;
}