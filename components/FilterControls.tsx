import React from 'react';
import { FlightStatus } from '../types';

interface FilterControlsProps {
  activeFilter: FlightStatus | 'All';
  onFilterChange: (filter: FlightStatus | 'All') => void;
}

const FILTERS: (FlightStatus | 'All')[] = [
  'All',
  FlightStatus.EN_ROUTE,
  FlightStatus.SCHEDULED,
  FlightStatus.LANDED,
  FlightStatus.DELAYED,
  FlightStatus.CANCELLED,
];

const getStatusColorIndicator = (status: FlightStatus | 'All') => {
    switch (status) {
      case FlightStatus.EN_ROUTE: return 'bg-green-400';
      case FlightStatus.LANDED: return 'bg-blue-400';
      case FlightStatus.SCHEDULED: return 'bg-yellow-400';
      case FlightStatus.DELAYED: return 'bg-orange-400';
      case FlightStatus.CANCELLED: return 'bg-red-400';
      default: return 'bg-slate-400';
    }
};

const FilterControls: React.FC<FilterControlsProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex flex-col gap-2 p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm z-10 border-r border-slate-700 sm:w-48 transition-all duration-300">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 hidden sm:block">Filter by Status</h3>
        {FILTERS.map(filter => {
            const isActive = activeFilter === filter;
            return (
                <button
                    key={filter}
                    onClick={() => onFilterChange(filter)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors w-full text-left flex items-center justify-center sm:justify-start gap-3 ${
                        isActive
                        ? 'bg-sky-500 text-white shadow-md'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                    aria-pressed={isActive}
                    title={filter}
                >
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getStatusColorIndicator(filter)}`}></span>
                    <span className="hidden sm:inline">{filter}</span>
                </button>
            );
        })}
    </div>
  );
};

export default FilterControls;
