import { MapPin, Calendar, Heart, MessageCircle, CreditCard as Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useTravel } from '../utils/travelContext';

const TravelLogCard = ({ log, isOwner = false, onEdit }) => {
  const { toggleLike, deleteTravelLog } = useTravel();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this travel log?')) {
      deleteTravelLog(log.id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1">
      <div className="relative h-64 overflow-hidden">
        <img
          src={log.image || 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=800'}
          alt={log.city}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          {isOwner && (
            <>
              <button
                onClick={() => onEdit(log)}
                className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
              >
                <Edit2 size={18} className="text-blue-600" />
              </button>
              <button
                onClick={handleDelete}
                className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
              >
                <Trash2 size={18} className="text-red-600" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{log.city}</h3>
            <div className="flex items-center text-gray-600 gap-2">
              <MapPin size={16} />
              <span className="text-sm">{log.country}</span>
            </div>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar size={16} className="mr-1" />
            {format(new Date(log.dateVisited), 'MMM dd, yyyy')}
          </div>
        </div>

        <p className="text-gray-700 mb-4 line-clamp-3">{log.notes}</p>

        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => toggleLike(log.id)}
            className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors group"
          >
            <Heart size={20} className="group-hover:fill-current" />
            <span className="font-medium">{log.likes}</span>
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
            <MessageCircle size={20} />
            <span className="font-medium">{log.comments}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TravelLogCard;
