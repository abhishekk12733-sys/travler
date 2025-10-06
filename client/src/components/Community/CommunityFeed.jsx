import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import {
  Heart,
  MessageCircle,
  Bookmark,
  MapPin,
  Calendar,
  User,
} from "lucide-react";

export default function CommunityFeed() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadPublicLogs();
  }, [filter]);

  const loadPublicLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/travelLogs/public");
      let fetchedLogs = res.data;

      if (filter !== "all") {
        fetchedLogs = fetchedLogs.filter((log) => log.status === filter);
      }

      setLogs(fetchedLogs);
    } catch (err) {
      console.error(
        "Error loading public logs:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.msg || "Error loading community feed.");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (logId, isLiked) => {
    if (!user) {
      setError("Please log in to like posts.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }

    try {
      const config = {
        headers: {
          "x-auth-token": token,
        },
      };
      if (isLiked) {
        await axios.put(`/api/travelLogs/unlike/${logId}`, {}, config);
      } else {
        await axios.put(`/api/travelLogs/like/${logId}`, {}, config);
      }
      loadPublicLogs(); // Reload logs to reflect changes
    } catch (err) {
      console.error(
        "Error liking/unliking log:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.msg || "Error updating like status.");
    }
  };

  const handleBookmark = async (logId, isBookmarked) => {
    if (!user) {
      setError("Please log in to bookmark posts.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }

    try {
      const config = {
        headers: {
          "x-auth-token": token,
        },
      };
      if (isBookmarked) {
        await axios.put(`/api/travelLogs/unbookmark/${logId}`, {}, config);
      } else {
        await axios.put(`/api/travelLogs/bookmark/${logId}`, {}, config);
      }
      loadPublicLogs(); // Reload logs to reflect changes
    } catch (err) {
      console.error(
        "Error bookmarking/unbookmarking log:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.msg || "Error updating bookmark status.");
    }
  };

  const filters = [
    { id: "all", label: "All Posts" },
    { id: "visited", label: "Visited" },
    { id: "wishlist", label: "Wishlist" },
    { id: "dream", label: "Dream" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Community</h2>
        <p className="text-gray-600">
          Discover amazing travel experiences from around the world
        </p>
      </div>

      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              filter === f.id
                ? "bg-blue-500 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50 shadow"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No posts yet
          </h3>
          <p className="text-gray-600">
            Be the first to share your travel story!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {logs.map((log) => (
            <div
              key={log._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-center space-x-3 mb-4">
                  {/* Placeholder for profile picture */}
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {log.user?.username || "Anonymous"}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
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

                {log.imageUrl && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img
                      src={log.imageUrl}
                      alt={log.title}
                      className="w-full h-72 object-cover"
                    />
                  </div>
                )}

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {log.title}
                </h3>

                <div className="flex items-center text-gray-600 text-sm space-x-4 mb-3">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{log.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(log.date).toLocaleDateString()}</span>
                  </div>
                </div>

                {log.description && (
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {log.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() =>
                        handleLike(
                          log._id,
                          log.likes.some((like) => like.user === user.id)
                        )
                      }
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition ${
                        log.likes.some((like) => like.user === user.id)
                          ? "bg-red-50 text-red-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          log.likes.some((like) => like.user === user.id)
                            ? "fill-current"
                            : ""
                        }`}
                      />
                      <span className="text-sm font-medium">
                        {log.likes.length}
                      </span>
                    </button>

                    <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        {/* {log.comments_count} */}0
                      </span>
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      handleBookmark(
                        log._id,
                        log.bookmarks.some(
                          (bookmark) => bookmark.user === user.id
                        )
                      )
                    }
                    className={`p-2 rounded-lg transition ${
                      log.bookmarks.some(
                        (bookmark) => bookmark.user === user.id
                      )
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Bookmark
                      className={`w-5 h-5 ${
                        log.bookmarks.some(
                          (bookmark) => bookmark.user === user.id
                        )
                          ? "fill-current"
                          : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
