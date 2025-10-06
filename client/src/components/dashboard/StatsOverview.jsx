import React from 'react';
import { MapPin, Calendar, Camera, Star } from 'lucide-react';

const StatsOverview = ({ travelLogs }) => {
  const stats = [
    {
      label: 'Countries Visited',
      value: new Set(travelLogs.map(log => log.country)).size,
      icon: MapPin,
      color: 'text-sky-600',
      bgColor: 'bg-sky-50'
    },
    {
      label: 'Cities Explored',
      value: new Set(travelLogs.map(log => `${log.city}, ${log.country}`)).size,
      icon: Calendar,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      label: 'Total Photos',
      value: travelLogs.reduce((total, log) => total + (log.images?.length || 0), 0),
      icon: Camera,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      label: 'Average Rating',
      value: travelLogs.length > 0 ? (travelLogs.reduce((sum, log) => sum + (log.rating || 0), 0) / travelLogs.length).toFixed(1) : '0',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsOverview;