import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Flight, FlightStatus } from './types';
import { fetchFlights, updateFlightPositions } from './services/flightService';
import Header from './components/Header';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import FilterControls from './components/FilterControls';
import { ToastContainer, toast } from './components/Toast';

const App: React.FC = () => {
  const [allFlights, setAllFlights] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FlightStatus | 'All'>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const loadFlights = async () => {
      try {
        setIsLoading(true);
        const flights = await fetchFlights();
        setAllFlights(flights);
      } catch (error) {
        console.error("Failed to fetch flights:", error);
        toast.error('Failed to load flight data.');
      } finally {
        setIsLoading(false);
      }
    };
    loadFlights();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAllFlights(prevFlights => updateFlightPositions(prevFlights));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);
  
  const handleStatusFilterChange = useCallback((status: FlightStatus | 'All') => {
    setStatusFilter(status);
  }, []);

  const filteredFlights = useMemo(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return allFlights.filter(flight => {
      const matchesStatus = statusFilter === 'All' || flight.status === statusFilter;
      if (!matchesStatus) return false;

      if (!searchQuery) return true;

      return (
        flight.callsign.toLowerCase().includes(lowerCaseQuery) ||
        flight.airline.toLowerCase().includes(lowerCaseQuery) ||
        flight.origin.toLowerCase().includes(lowerCaseQuery) ||
        flight.destination.toLowerCase().includes(lowerCaseQuery) ||
        flight.originCode.toLowerCase().includes(lowerCaseQuery) ||
        flight.destinationCode.toLowerCase().includes(lowerCaseQuery)
      );
    });
  }, [allFlights, searchQuery, statusFilter]);


  const handleSelectFlight = useCallback((flight: Flight | null) => {
    setSelectedFlight(flight);
    setIsSidebarOpen(!!flight);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false);
    // Delay clearing selected flight to allow for closing animation
    setTimeout(() => {
        setSelectedFlight(null);
    }, 300);
  }, []);
  
  const centerPosition: [number, number] = useMemo(() => {
    if (selectedFlight) {
        return [selectedFlight.latitude, selectedFlight.longitude];
    }
    return [20, 0]; // Default world view
  }, [selectedFlight]);

  const zoomLevel: number = useMemo(() => {
    return selectedFlight ? 7 : 2;
  }, [selectedFlight]);


  return (
    <div className="h-screen w-screen flex flex-col bg-slate-900 text-slate-50 overflow-hidden">
      <Header searchQuery={searchQuery} onSearchChange={handleSearch} />
      <main className="flex-1 flex overflow-hidden">
        <FilterControls
          activeFilter={statusFilter}
          onFilterChange={handleStatusFilterChange}
        />
        <div className="flex-1 relative">
            {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-20">
                <div className="flex flex-col items-center gap-4">
                <svg className="animate-spin h-10 w-10 text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-slate-300">Loading Flight Data...</p>
                </div>
            </div>
            ) : null}
            <Map
            flights={filteredFlights}
            onSelectFlight={handleSelectFlight}
            selectedFlight={selectedFlight}
            center={centerPosition}
            zoom={zoomLevel}
            />
            <Sidebar
            flight={selectedFlight}
            isOpen={isSidebarOpen}
            onClose={handleCloseSidebar}
            />
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};

export default App;