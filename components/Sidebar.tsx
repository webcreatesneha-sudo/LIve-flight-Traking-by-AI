
import React, { useState, useEffect } from 'react';
import { Flight, FlightStatus } from '../types';
import { generateFlightStory } from '../services/geminiService';
import { toast } from './Toast';

interface SidebarProps {
  flight: Flight | null;
  isOpen: boolean;
  onClose: () => void;
}

const StorySection: React.FC<{ flight: Flight }> = ({ flight }) => {
    const [story, setStory] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchStory = async (currentFlight: Flight) => {
        setIsLoading(true);
        setStory('');
        try {
            const generatedStory = await generateFlightStory(currentFlight);
            setStory(generatedStory);
        } catch (error) {
            console.error('Failed to generate flight story:', error);
            toast.error("Couldn't generate flight story. Please try again.");
            setStory('An error occurred while generating the flight story.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (flight) {
            fetchStory(flight);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flight]);

    return (
        <div className="bg-slate-800 rounded-lg p-4 mt-4">
            <h3 className="text-lg font-bold text-sky-400 mb-2">Flight Story by Gemini</h3>
            {isLoading ? (
                <div className="flex items-center gap-2 text-slate-400">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating a unique story for this flight...</span>
                </div>
            ) : (
                <p className="text-slate-300 text-sm leading-relaxed">{story}</p>
            )}
        </div>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ flight, isOpen, onClose }) => {
  const getStatusColor = (status: FlightStatus) => {
    switch (status) {
      case FlightStatus.EN_ROUTE: return 'text-green-400 bg-green-900/50';
      case FlightStatus.LANDED: return 'text-blue-400 bg-blue-900/50';
      case FlightStatus.SCHEDULED: return 'text-yellow-400 bg-yellow-900/50';
      case FlightStatus.DELAYED: return 'text-orange-400 bg-orange-900/50';
      case FlightStatus.CANCELLED: return 'text-red-400 bg-red-900/50';
      default: return 'text-slate-400 bg-slate-700';
    }
  };

  const formatTime = (date: Date) => {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC';
  }

  return (
    <>
        <div 
            className={`fixed inset-0 bg-black/60 z-20 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
        />
        <aside className={`fixed top-0 right-0 h-full w-full max-w-sm bg-slate-900/80 backdrop-blur-md shadow-2xl z-30 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} border-l border-slate-700`}>
            {flight ? (
                <div className="p-6 h-full flex flex-col text-slate-100">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white">{flight.callsign}</h2>
                            <p className="text-md text-slate-400">{flight.airline}</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                        {/* Route Info */}
                        <div className="flex items-center justify-between my-4 text-center">
                            <div className="flex-1">
                                <p className="text-2xl font-bold">{flight.originCode}</p>
                                <p className="text-sm text-slate-400 truncate">{flight.origin}</p>
                                <p className="text-sm text-slate-300">{formatTime(flight.departureTime)}</p>
                            </div>
                            <div className="flex-1 flex items-center justify-center text-slate-500">
                                <span className="w-12 h-px bg-slate-600"></span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mx-2">
                                  <path fillRule="evenodd" d="M15.28 9.47a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 11-1.06-1.06L13.69 10 9.97 6.28a.75.75 0 011.06-1.06l4.25 4.25z" clipRule="evenodd" />
                                  <path fillRule="evenodd" d="M4.72 9.47a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 11-1.06-1.06L-1.31 10l-3.72-3.72a.75.75 0 011.06-1.06l4.25 4.25z" clipRule="evenodd" />
                                </svg>
                                <span className="w-12 h-px bg-slate-600"></span>
                            </div>
                            <div className="flex-1">
                                <p className="text-2xl font-bold">{flight.destinationCode}</p>
                                <p className="text-sm text-slate-400 truncate">{flight.destination}</p>
                                <p className="text-sm text-slate-300">{formatTime(flight.arrivalTime)}</p>
                            </div>
                        </div>

                        {/* Status & Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm mt-6">
                            <div className="bg-slate-800 rounded-lg p-3">
                                <p className="text-slate-400">Status</p>
                                <p className={`font-bold text-lg px-2 py-1 rounded-md inline-block mt-1 ${getStatusColor(flight.status)}`}>{flight.status}</p>
                            </div>
                             <div className="bg-slate-800 rounded-lg p-3">
                                <p className="text-slate-400">Aircraft</p>
                                <p className="font-bold text-lg text-white">{flight.aircraftType}</p>
                            </div>
                             <div className="bg-slate-800 rounded-lg p-3">
                                <p className="text-slate-400">Altitude</p>
                                <p className="font-bold text-lg text-white">{flight.status === FlightStatus.EN_ROUTE ? `${flight.altitude.toLocaleString()} ft` : 'N/A'}</p>
                            </div>
                             <div className="bg-slate-800 rounded-lg p-3">
                                <p className="text-slate-400">Ground Speed</p>
                                <p className="font-bold text-lg text-white">{flight.status === FlightStatus.EN_ROUTE ? `${flight.speed} kts` : 'N/A'}</p>
                            </div>
                        </div>
                        
                        <StorySection flight={flight} />
                    </div>
                </div>
            ) : (
                <div className="p-6 text-center text-slate-400">
                    <p>Select a flight on the map to see details.</p>
                </div>
            )}
        </aside>
    </>
  );
};

export default Sidebar;
