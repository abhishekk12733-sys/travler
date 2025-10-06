import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useAuth } from "../../contexts/AuthContext";
import { MapPin, Calendar } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const createCustomIcon = (color) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(45deg);
        ">
        </div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

export default function WorldMap() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (user) {
      loadLogs();
    } else {
      setLogs([]);
      setLoading(false);
    }
  }, [user, filter]);

  const loadLogs = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "x-auth-token": token,
        },
      };
      const res = await axios.get("/api/travelLogs", config);
      let fetchedLogs = res.data;

      // Filter logs that have latitude and longitude
      fetchedLogs = fetchedLogs.filter(
        (log) => log.latitude !== null && log.longitude !== null
      );

      if (filter !== "all") {
        fetchedLogs = fetchedLogs.filter((log) => log.status === filter);
      }

      setLogs(fetchedLogs);
    } catch (err) {
      console.error(
        "Error loading logs for map:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.msg || "Error loading travel logs for map.");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const getMarkerColor = (status) => {
    switch (status) {
      case "visited":
        return "#10b981";
      case "wishlist":
        return "#f59e0b";
      case "dream":
        return "#a855f7";
      default:
        return "#3b82f6";
    }
  };

  const filters = [
    { id: "all", label: "All" },
    { id: "visited", label: "Visited" },
    { id: "wishlist", label: "Wishlist" },
    { id: "dream", label: "Dream" },
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white shadow-md px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">World Map</h2>
              <p className="text-gray-600 text-sm">
                Explore your travel locations
              </p>
            </div>
            <div className="flex space-x-2">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                    filter === f.id
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No locations to display
              </h3>
              <p className="text-gray-600">
                Add coordinates to your travel logs to see them on the map
              </p>
            </div>
          </div>
        ) : (
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: "100%", width: "100%" }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {logs.map((log) => (
              <Marker
                key={log._id}
                position={[parseFloat(log.latitude), parseFloat(log.longitude)]}
                icon={createCustomIcon(getMarkerColor(log.status))}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {log.title}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{log.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(log.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {log.description && (
                      <p className="mt-2 text-sm text-gray-700 line-clamp-3">
                        {log.description}
                      </p>
                    )}
                    <div className="mt-2">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          log.status === "visited"
                            ? "bg-green-100 text-green-700"
                            : log.status === "wishlist"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {log.status === "visited"
                          ? "Visited"
                          : log.status === "wishlist"
                          ? "Wishlist"
                          : "Dream"}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
