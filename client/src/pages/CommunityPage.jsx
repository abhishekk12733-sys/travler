import React, { useState } from 'react';
import { Heart, MessageCircle, Bookmark, Share, MapPin, Calendar, TrendingUp, Users } from 'lucide-react';

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('feed');

  const travelPosts = [
    {
      id: 1,
      user: {
        name: 'Sarah Chen',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        username: '@sarahtravel'
      },
      location: 'Kyoto, Japan',
      image: 'https://images.pexels.com/photos/1822605/pexels-photo-1822605.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'Magical morning at Fushimi Inari Shrine 🏯 The thousand torii gates create such a mystical atmosphere. Started early at 6 AM to avoid crowds - totally worth it!',
      likes: 245,
      comments: 18,
      timeAgo: '2 hours ago',
      tags: ['temple', 'sunrise', 'peaceful']
    },
    {
      id: 2,
      user: {
        name: 'Marcus Johnson',
        avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
        username: '@wanderlust_mark'
      },
      location: 'Santorini, Greece',
      image: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'Sunset dinner in Oia never gets old ✨ This little taverna has the best moussaka and an incredible view. Local tip: book at least 2 days ahead!',
      likes: 389,
      comments: 24,
      timeAgo: '5 hours ago',
      tags: ['sunset', 'foodie', 'romantic']
    },
    {
      id: 3,
      user: {
        name: 'Emma Rodriguez',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100',
        username: '@emmaexplores'
      },
      location: 'Machu Picchu, Peru',
      image: 'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'After 4 days on the Inca Trail, finally reached Machu Picchu! 🏔️ The ancient engineering is absolutely mind-blowing. Every sore muscle was worth this moment.',
      likes: 512,
      comments: 35,
      timeAgo: '8 hours ago',
      tags: ['hiking', 'adventure', 'history']
    }
  ];

  const trendingDestinations = [
    { name: 'Bali, Indonesia', posts: 1245, growth: '+15%' },
    { name: 'Iceland', posts: 892, growth: '+23%' },
    { name: 'Portugal', posts: 734, growth: '+18%' },
    { name: 'Japan', posts: 1567, growth: '+8%' },
    { name: 'Morocco', posts: 445, growth: '+34%' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Travel Community</h1>
        <p className="text-gray-600">Discover amazing destinations through the eyes of fellow travelers</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-8 border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab('feed')}
          className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'feed'
              ? 'border-sky-500 text-sky-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Travel Feed
        </button>
        <button
          onClick={() => setActiveTab('trending')}
          className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'trending'
              ? 'border-sky-500 text-sky-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Trending
        </button>
        <button
          onClick={() => setActiveTab('following')}
          className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'following'
              ? 'border-sky-500 text-sky-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Following
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeTab === 'feed' && (
            <div className="space-y-6">
              {travelPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {/* Post Header */}
                  <div className="p-4 flex items-center space-x-3">
                    <img
                      src={post.user.avatar}
                      alt={post.user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{post.location}</span>
                        <span>•</span>
                        <span>{post.timeAgo}</span>
                      </div>
                    </div>
                  </div>

                  {/* Post Image */}
                  <div className="relative">
                    <img
                      src={post.image}
                      alt={post.location}
                      className="w-full h-80 object-cover"
                    />
                  </div>

                  {/* Post Content */}
                  <div className="p-4">
                    <p className="text-gray-800 mb-3 leading-relaxed">{post.caption}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-sm font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
                          <Heart className="h-5 w-5" />
                          <span className="text-sm font-medium">{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-sky-600 transition-colors">
                          <MessageCircle className="h-5 w-5" />
                          <span className="text-sm font-medium">{post.comments}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors">
                          <Share className="h-5 w-5" />
                          <span className="text-sm font-medium">Share</span>
                        </button>
                      </div>
                      <button className="text-gray-600 hover:text-yellow-500 transition-colors">
                        <Bookmark className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'trending' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Trending Destinations</h2>
              <div className="space-y-4">
                {trendingDestinations.map((destination, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-sky-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{destination.name}</h3>
                        <p className="text-sm text-gray-600">{destination.posts} posts</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-emerald-600">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-medium">{destination.growth}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'following' && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Following Yet</h3>
              <p className="text-gray-600 mb-4">
                Follow other travelers to see their adventures in your feed.
              </p>
              <button className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg transition-colors">
                Discover Travelers
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Community Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Community</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Travelers</span>
                <span className="font-semibold text-gray-900">25,487</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Countries Covered</span>
                <span className="font-semibold text-gray-900">195</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Posts This Week</span>
                <span className="font-semibold text-gray-900">1,234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Photos Shared</span>
                <span className="font-semibold text-gray-900">50K+</span>
              </div>
            </div>
          </div>

          {/* Featured Travelers */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Travelers</h3>
            <div className="space-y-4">
              {[
                { name: 'Alex Chen', username: '@alexadventure', followers: '12.5K', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100' },
                { name: 'Maria Santos', username: '@mariatravels', followers: '8.9K', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100' },
                { name: 'David Kim', username: '@wanderdavid', followers: '15.2K', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100' }
              ].map((traveler, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={traveler.avatar}
                      alt={traveler.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{traveler.name}</h4>
                      <p className="text-xs text-gray-600">{traveler.followers} followers</p>
                    </div>
                  </div>
                  <button className="text-sky-600 hover:text-sky-700 text-sm font-medium">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Travel Tips */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">💡 Travel Tip of the Day</h3>
            <p className="text-sm leading-relaxed">
              When photographing famous landmarks, try visiting during golden hour (1 hour before sunset) for the most magical lighting and fewer crowds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;