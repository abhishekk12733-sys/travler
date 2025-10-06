import React, { useState } from 'react';
import { MapPin, Calendar, Camera, Star, Trash2, CreditCard as Edit } from 'lucide-react';
import { format } from 'date-fns';

const TravelLogCard = ({ log, onDelete }) => {
  const [imageError, setImageError] = useState({});

  const handleImageError = (index) => {
    setImageError(prev => ({ ...prev, [index]: true }));
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Images */}
      {log.images && log.images.length > 0 && (
        <div className="relative h-64 overflow-hidden">
          <div className="flex space-x-2 h-full">
            {log.images.slice(0, 3).map((image, index) => (
              <div key={index} className={`relative ${index === 0 ? 'flex-2' : 'flex-1'} h-full`}>
                {!imageError[index] ? (
                  <img
                    src={image}
                    alt={`${log.city}, ${log.country}`}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(index)}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                {index === 2 && log.images.length > 3 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      +{log.images.length - 3}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-md transition-all">
              <Edit className="h-4 w-4 text-gray-600" />
            </button>
            <button 
              onClick={onDelete}
              className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-md transition-all hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {log.city}, {log.country}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(log.date), 'MMM dd, yyyy')}</span>
              </div>
              {log.images && log.images.length > 0 && (
                <div className="flex items-center space-x-1">
                  <Camera className="h-4 w-4" />
                  <span>{log.images.length} photos</span>
                </div>
              )}
            </div>
          </div>
          {log.rating && (
            <div className="flex items-center space-x-1">
              {renderStars(log.rating)}
            </div>
          )}
        </div>

        {log.notes && (
          <p className="text-gray-700 leading-relaxed mb-4">
            {log.notes.length > 200 ? `${log.notes.substring(0, 200)}...` : log.notes}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-sky-600">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">View on Map</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              {Math.floor(Math.random() * 50) + 10} likes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelLogCard;