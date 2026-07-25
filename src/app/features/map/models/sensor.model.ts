export interface Sensor {
  id: string;
  name: string;
  lat: number;
  lng: number;
  active: boolean;
  areaId: string;
  lastSignal: string;
  metrics: {
    aqi: number;
    pm10: number;
    pm25: number;
    no2: number;
  };
}
