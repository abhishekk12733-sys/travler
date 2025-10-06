import { useState } from 'react';
import { TrendingUp, Search } from 'lucide-react';
import { useTravel } from '../utils/travelContext';
import TravelLogCard from './TravelLogCard';

const CommunityFeed = () => {
  const { communityPosts } = useTravel();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredPosts = communityPosts
    .filter(post => {
      const matchesSearch = post.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.country.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (filter === 'popular') return b.likes - a.likes;
      if (filter === 'recent') return new Date(b.dateVisited) - new Date(a.dateVisited);
      return 0;
    });

  const trendingDestinations = [...new Set(communityPosts.map(post => post.country))]
    .map(country => ({
      country,
      count: communityPosts.filter(post => post.country === country).length,
      likes: communityPosts.filter(post => post.country === country).reduce((sum, post) => sum + post.likes, 0)
    }))
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Community Feed</h1>
        <p className="text-gray-600 text-lg">Discover amazing travel experiences from around the world</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-orange-500" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Trending Destinations</h2>
            </div>

            <div className="space-y-3">
              {trendingDestinations.map((dest, index) => (
                <div
                  key={dest.country}
                  className="p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-orange-600">#{index + 1}</span>
                        <span className="font-semibold text-gray-800">{dest.country}</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {dest.count} {dest.count === 1 ? 'post' : 'posts'} • {dest.likes} likes
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destinations..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">All Posts</option>
                <option value="popular">Most Popular</option>
                <option value="recent">Most Recent</option>
              </select>
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Search size={64} className="mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No posts found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.map(post => (
                <TravelLogCard key={post.id} log={post} isOwner={post.userId === 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityFeed;
