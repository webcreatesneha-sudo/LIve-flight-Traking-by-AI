
export enum FlightStatus {
  SCHEDULED = 'Scheduled',
  EN_ROUTE = 'En Route',
  LANDED = 'Landed',
  DELAYED = 'Delayed',
  CANCELLED = 'Cancelled',
}

export interface Flight {
  icao24: string;
  callsign: string;
  airline: string;
  aircraftType: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  departureTime: Date;
  arrivalTime: Date;
  status: FlightStatus;
  latitude: number;
  longitude: number;
  altitude: number; // in feet
  speed: number; // in knots
  heading: number; // in degrees
}
