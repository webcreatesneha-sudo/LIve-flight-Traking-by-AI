
import { Flight, FlightStatus } from '../types';

const airlines = ['Lufthansa', 'Delta', 'United', 'Emirates', 'British Airways', 'Air France', 'Ryanair', 'Southwest', 'KLM', 'Qatar Airways'];
const aircraft = ['B737', 'A320', 'B777', 'A380', 'B787', 'A350', 'CRJ900'];
const origins = [
  { name: 'London Heathrow', code: 'LHR', lat: 51.47, lon: -0.45 },
  { name: 'New York JFK', code: 'JFK', lat: 40.64, lon: -73.77 },
  { name: 'Tokyo Haneda', code: 'HND', lat: 35.55, lon: 139.78 },
  { name: 'Dubai International', code: 'DXB', lat: 25.25, lon: 55.36 },
  { name: 'Los Angeles Intl', code: 'LAX', lat: 33.94, lon: -118.40 },
  { name: 'Paris Charles de Gaulle', code: 'CDG', lat: 49.01, lon: 2.55 },
  { name: 'Singapore Changi', code: 'SIN', lat: 1.36, lon: 103.99 },
  { name: 'Sydney Airport', code: 'SYD', lat: -33.94, lon: 151.17 },
];

const generateRandomFlight = (index: number): Flight => {
  const origin = origins[index % origins.length];
  const destination = origins[(index + 3) % origins.length];
  const statusOptions = [FlightStatus.EN_ROUTE, FlightStatus.SCHEDULED, FlightStatus.LANDED, FlightStatus.DELAYED];
  const status = statusOptions[index % statusOptions.length];
  
  const progress = Math.random();
  const lat = origin.lat + (destination.lat - origin.lat) * progress;
  const lon = origin.lon + (destination.lon - origin.lon) * progress;

  const depTime = new Date();
  depTime.setHours(depTime.getHours() - Math.floor(progress * 8));
  const arrTime = new Date();
  arrTime.setHours(arrTime.getHours() + Math.floor((1 - progress) * 8));


  return {
    icao24: `a${Math.random().toString(16).slice(2, 8)}`,
    callsign: `${airlines[index % airlines.length].replace(/\s/g, '').slice(0, 3).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`,
    airline: airlines[index % airlines.length],
    aircraftType: aircraft[index % aircraft.length],
    origin: origin.name,
    originCode: origin.code,
    destination: destination.name,
    destinationCode: destination.code,
    departureTime: depTime,
    arrivalTime: arrTime,
    status: status,
    latitude: status === FlightStatus.EN_ROUTE ? lat : origin.lat,
    longitude: status === FlightStatus.EN_ROUTE ? lon : origin.lon,
    altitude: status === FlightStatus.EN_ROUTE ? Math.floor(25000 + Math.random() * 15000) : 0,
    speed: status === FlightStatus.EN_ROUTE ? Math.floor(400 + Math.random() * 150) : 0,
    heading: Math.floor(Math.random() * 360),
  };
};

const mockFlights: Flight[] = Array.from({ length: 50 }, (_, i) => generateRandomFlight(i));

export const fetchFlights = async (): Promise<Flight[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  return mockFlights;
};

export const updateFlightPositions = (flights: Flight[]): Flight[] => {
  return flights.map(flight => {
    if (flight.status === FlightStatus.EN_ROUTE) {
      const headingRad = (flight.heading * Math.PI) / 180;
      const speedInDegPer5Sec = (flight.speed / 60 / 3600) * 5 * 2; // Simplified conversion

      const newLat = flight.latitude + speedInDegPer5Sec * Math.cos(headingRad);
      const newLon = flight.longitude + speedInDegPer5Sec * Math.sin(headingRad);

      // Random small adjustments to altitude and heading for realism
      const newAltitude = flight.altitude + (Math.random() - 0.5) * 100;
      const newHeading = (flight.heading + (Math.random() - 0.5) * 1) % 360;

      return {
        ...flight,
        latitude: newLat,
        longitude: newLon,
        altitude: Math.max(1000, newAltitude), // Ensure it doesn't go below 1000ft
        heading: newHeading > 0 ? newHeading : 360 + newHeading,
      };
    }
    return flight;
  });
};
