import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useState } from 'react';
import { Filter } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const InteractiveMap = ({ travelLogs = [], wishlist = [] }) => {
  const [filter, setFilter] = useState('all');

  const visitedIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const wishlistIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const getFilteredData = () => {
    const data = [];
    if (filter === 'all' || filter === 'visited') {
      data.push(...travelLogs.filter(log => log.lat && log.lng).map(log => ({
        ...log,
        type: 'visited',
        icon: visitedIcon
      })));
    }
    if (filter === 'all' || filter === 'wishlist') {
      data.push(...wishlist.map(item => ({
        ...item,
        type: 'wishlist',
        icon: wishlistIcon
      })));
    }
    return data;
  };

  const filteredData = getFilteredData();

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">My Travel Map</h2>
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-white" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border-0 bg-white/20 text-white font-medium backdrop-blur-sm outline-none cursor-pointer"
          >
            <option value="all">All</option>
            <option value="visited">Visited</option>
            <option value="wishlist">Wishlist</option>
          </select>
        </div>
      </div>

      <div className="h-[500px] relative">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          className="h-full w-full"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredData.map((item, index) => (
            <Marker
              key={`${item.type}-${item.id || index}`}
              position={[parseFloat(item.lat), parseFloat(item.lng)]}
              icon={item.icon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg mb-1">{item.city}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.country}</p>
                  {item.type === 'visited' && (
                    <>
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.city}
                          className="w-full h-32 object-cover rounded-lg mb-2"
                        />
                      )}
                      <p className="text-gray-700 text-sm">{item.notes?.substring(0, 100)}...</p>
                      <p className="text-gray-500 text-xs mt-2">
                        Visited: {new Date(item.dateVisited).toLocaleDateString()}
                      </p>
                    </>
                  )}
                  {item.type === 'wishlist' && (
                    <p className="text-red-600 font-medium text-sm">On Wishlist</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="p-4 bg-gray-50 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-700 font-medium">Visited ({travelLogs.filter(log => log.lat && log.lng).length})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-700 font-medium">Wishlist ({wishlist.length})</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
