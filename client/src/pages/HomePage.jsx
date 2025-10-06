import React from "react";
import { Link } from "react-router-dom";
import { Globe, Plus, Map, Calendar, Users, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-8 shadow-lg">
          <Globe className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          Your World, Your Stories, Your TravelDiary
        </h1>
        <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
          Effortlessly document your adventures, explore new destinations, and
          connect with a global community of travelers.
        </p>

        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <Link
            to="/my-logs"
            className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Plus className="w-6 h-6" />
            <span>Start Your Journey</span>
          </Link>
          <Link
            to="/community"
            className="flex items-center space-x-3 px-8 py-4 bg-white text-gray-800 rounded-xl font-semibold text-lg border border-gray-200 hover:bg-gray-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Users className="w-6 h-6 text-purple-600" />
            <span>Explore Community</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center transform hover:scale-105 transition duration-300">
            <Map className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Interactive Map
            </h3>
            <p className="text-gray-600">
              Visualize your travels on a dynamic world map.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center transform hover:scale-105 transition duration-300">
            <Calendar className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Travel Calendar
            </h3>
            <p className="text-gray-600">
              Keep track of past and future trips with ease.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center transform hover:scale-105 transition duration-300">
            <Sparkles className="w-12 h-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              AI Assistant
            </h3>
            <p className="text-gray-600">
              Get personalized recommendations and insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
