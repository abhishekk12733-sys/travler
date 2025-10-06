import React, { useState } from 'react';
import { Bot, MapPin, Package, Calculator, Send, Sparkles, Globe, Clock, DollarSign } from 'lucide-react';

const AIAssistantPage = () => {
  const [activeTool, setActiveTool] = useState('itinerary');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const tools = [
    {
      id: 'itinerary',
      name: 'Itinerary Planner',
      description: 'Get AI-powered day-by-day travel plans',
      icon: MapPin,
      color: 'bg-sky-500'
    },
    {
      id: 'packing',
      name: 'Packing List',
      description: 'Smart packing suggestions based on destination',
      icon: Package,
      color: 'bg-emerald-500'
    },
    {
      id: 'budget',
      name: 'Budget Estimator',
      description: 'Calculate travel costs for different styles',
      icon: Calculator,
      color: 'bg-orange-500'
    },
    {
      id: 'summary',
      name: 'Trip Summary',
      description: 'Summarize your travel experiences with AI',
      icon: Sparkles,
      color: 'bg-purple-500'
    }
  ];

  const handleGenerate = async (formData) => {
    setLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI responses based on tool
    let mockResult;
    switch (activeTools) {
      case 'itinerary':
        mockResult = {
          destination: formData.destination,
          days: formData.days,
          budget: formData.budget,
          plan: [
            {
              day: 1,
              title: 'Arrival & City Center',
              activities: [
                { time: '9:00 AM', activity: 'Check-in to hotel', cost: '$0' },
                { time: '11:00 AM', activity: 'Walking tour of historic center', cost: '$25' },
                { time: '1:00 PM', activity: 'Local lunch at recommended restaurant', cost: '$35' },
                { time: '3:00 PM', activity: 'Visit main museum/attraction', cost: '$20' },
                { time: '7:00 PM', activity: 'Dinner at rooftop restaurant', cost: '$50' }
              ]
            },
            {
              day: 2,
              title: 'Cultural Exploration',
              activities: [
                { time: '8:00 AM', activity: 'Breakfast at local café', cost: '$15' },
                { time: '9:30 AM', activity: 'Guided cultural tour', cost: '$45' },
                { time: '12:00 PM', activity: 'Traditional lunch experience', cost: '$40' },
                { time: '2:30 PM', activity: 'Art gallery/local market visit', cost: '$15' },
                { time: '6:00 PM', activity: 'Sunset viewing spot', cost: '$0' }
              ]
            }
          ]
        };
        break;
      case 'packing':
        mockResult = {
          destination: formData.destination,
          duration: formData.duration,
          season: formData.season,
          categories: {
            clothing: [
              'Light jacket or sweater',
              'Comfortable walking shoes',
              'Casual day outfits (3-4)',
              'One dressy outfit',
              'Undergarments and socks',
              'Sleepwear'
            ],
            electronics: [
              'Phone charger',
              'Universal adapter',
              'Portable battery pack',
              'Camera (optional)',
              'Headphones'
            ],
            documents: [
              'Passport/ID',
              'Travel insurance',
              'Hotel confirmations',
              'Flight tickets',
              'Emergency contacts'
            ],
            toiletries: [
              'Toothbrush and toothpaste',
              'Shampoo/conditioner',
              'Sunscreen',
              'Personal medications',
              'Travel-size essentials'
            ]
          }
        };
        break;
      case 'budget':
        mockResult = {
          destination: formData.destination,
          duration: formData.duration,
          styles: {
            budget: {
              total: 450,
              breakdown: {
                accommodation: 120,
                food: 150,
                transport: 80,
                activities: 70,
                miscellaneous: 30
              }
            },
            mid: {
              total: 850,
              breakdown: {
                accommodation: 280,
                food: 280,
                transport: 120,
                activities: 120,
                miscellaneous: 50
              }
            },
            luxury: {
              total: 1800,
              breakdown: {
                accommodation: 600,
                food: 500,
                transport: 250,
                activities: 300,
                miscellaneous: 150
              }
            }
          }
        };
        break;
      default:
        mockResult = { message: 'AI processing complete!' };
    }
    
    setResult(mockResult);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-4 rounded-full">
            <Bot className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Travel Assistant</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Get personalized travel recommendations, itineraries, and insights powered by artificial intelligence.
        </p>
      </div>

      {/* Tool Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTools(tool.id)}
              className={`p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 ${
                activeTools === tool.id
                  ? 'bg-white border-2 border-sky-500 shadow-xl'
                  : 'bg-white hover:shadow-xl'
              }`}
            >
              <div className={`${tool.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.name}</h3>
              <p className="text-sm text-gray-600">{tool.description}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            {tools.find(t => t.id === activeTools)?.name}
          </h2>

          {activeTools === 'itinerary' && (
            <ItineraryForm onSubmit={handleGenerate} loading={loading} />
          )}
          {activeTools === 'packing' && (
            <PackingForm onSubmit={handleGenerate} loading={loading} />
          )}
          {activeTools === 'budget' && (
            <BudgetForm onSubmit={handleGenerate} loading={loading} />
          )}
          {activeTools === 'summary' && (
            <SummaryForm onSubmit={handleGenerate} loading={loading} />
          )}
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">AI Results</h2>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mb-4"></div>
              <p className="text-gray-600">AI is generating your personalized recommendations...</p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {activeTools === 'itinerary' && <ItineraryResult data={result} />}
              {activeTools === 'packing' && <PackingResult data={result} />}
              {activeTools === 'budget' && <BudgetResult data={result} />}
              {activeTools === 'summary' && <SummaryResult data={result} />}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Fill out the form to get AI-powered travel recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Form Components
const ItineraryForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    destination: '',
    days: '',
    budget: '',
    interests: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Destination
        </label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            required
            value={formData.destination}
            onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="e.g., Tokyo, Japan"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Number of Days
        </label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="number"
            required
            min="1"
            max="30"
            value={formData.days}
            onChange={(e) => setFormData(prev => ({ ...prev, days: e.target.value }))}
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="e.g., 5"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Travel Style
        </label>
        <select
          required
          value={formData.budget}
          onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="">Select travel style</option>
          <option value="budget">Budget Traveler</option>
          <option value="mid-range">Mid-range</option>
          <option value="luxury">Luxury</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>Generate Itinerary</span>
          </>
        )}
      </button>
    </form>
  );
};

const PackingForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    destination: '',
    duration: '',
    season: '',
    activities: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Destination
        </label>
        <input
          type="text"
          required
          value={formData.destination}
          onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="e.g., Iceland"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Trip Duration
        </label>
        <select
          required
          value={formData.duration}
          onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="">Select duration</option>
          <option value="1-3 days">1-3 days</option>
          <option value="4-7 days">4-7 days</option>
          <option value="1-2 weeks">1-2 weeks</option>
          <option value="2+ weeks">2+ weeks</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Season/Weather
        </label>
        <select
          required
          value={formData.season}
          onChange={(e) => setFormData(prev => ({ ...prev, season: e.target.value }))}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="">Select season</option>
          <option value="spring">Spring (Mild)</option>
          <option value="summer">Summer (Hot)</option>
          <option value="autumn">Autumn (Cool)</option>
          <option value="winter">Winter (Cold)</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <>
            <Package className="h-4 w-4" />
            <span>Generate Packing List</span>
          </>
        )}
      </button>
    </form>
  );
};

const BudgetForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    destination: '',
    duration: '',
    travelers: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Destination
        </label>
        <input
          type="text"
          required
          value={formData.destination}
          onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="e.g., Bali, Indonesia"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Trip Duration (days)
        </label>
        <input
          type="number"
          required
          min="1"
          value={formData.duration}
          onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="e.g., 7"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Number of Travelers
        </label>
        <select
          required
          value={formData.travelers}
          onChange={(e) => setFormData(prev => ({ ...prev, travelers: e.target.value }))}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="">Select travelers</option>
          <option value="1">Solo (1 person)</option>
          <option value="2">Couple (2 people)</option>
          <option value="3-4">Small group (3-4 people)</option>
          <option value="5+">Large group (5+ people)</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <>
            <DollarSign className="h-4 w-4" />
            <span>Estimate Budget</span>
          </>
        )}
      </button>
    </form>
  );
};

const SummaryForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    destination: '',
    activities: '',
    highlights: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Destination
        </label>
        <input
          type="text"
          required
          value={formData.destination}
          onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="e.g., Manali, India"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Activities & Experiences
        </label>
        <textarea
          required
          value={formData.activities}
          onChange={(e) => setFormData(prev => ({ ...prev, activities: e.target.value }))}
          rows={3}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
          placeholder="e.g., saw snow, did paragliding, stayed in local Airbnb, tried local food..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Special Highlights
        </label>
        <textarea
          value={formData.highlights}
          onChange={(e) => setFormData(prev => ({ ...prev, highlights: e.target.value }))}
          rows={2}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
          placeholder="Any special moments or memorable experiences..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            <span>Generate Summary</span>
          </>
        )}
      </button>
    </form>
  );
};

// Result Components
const ItineraryResult = ({ data }) => (
  <div className="space-y-4">
    <div className="border-b border-gray-200 pb-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {data.days}-Day Itinerary for {data.destination}
      </h3>
      <p className="text-sm text-gray-600">Travel Style: {data.budget}</p>
    </div>
    {data.plan.map((day) => (
      <div key={day.day} className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">
          Day {day.day}: {day.title}
        </h4>
        <div className="space-y-2">
          {day.activities.map((activity, index) => (
            <div key={index} className="flex justify-between items-start">
              <div>
                <span className="text-sm font-medium text-sky-600">{activity.time}</span>
                <p className="text-sm text-gray-800">{activity.activity}</p>
              </div>
              <span className="text-sm font-semibold text-gray-600">{activity.cost}</span>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const PackingResult = ({ data }) => (
  <div className="space-y-4">
    <div className="border-b border-gray-200 pb-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Packing List for {data.destination}
      </h3>
      <p className="text-sm text-gray-600">{data.duration} • {data.season}</p>
    </div>
    {Object.entries(data.categories).map(([category, items]) => (
      <div key={category} className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3 capitalize">{category}</h4>
        <ul className="space-y-1">
          {items.map((item, index) => (
            <li key={index} className="text-sm text-gray-800 flex items-center">
              <span className="w-2 h-2 bg-sky-500 rounded-full mr-2"></span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

const BudgetResult = ({ data }) => (
  <div className="space-y-4">
    <div className="border-b border-gray-200 pb-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Budget Estimate for {data.destination}
      </h3>
      <p className="text-sm text-gray-600">{data.duration} days</p>
    </div>
    {Object.entries(data.styles).map(([style, budget]) => (
      <div key={style} className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold text-gray-900 capitalize">{style} Travel</h4>
          <span className="text-2xl font-bold text-sky-600">${budget.total}</span>
        </div>
        <div className="space-y-2">
          {Object.entries(budget.breakdown).map(([category, amount]) => (
            <div key={category} className="flex justify-between text-sm">
              <span className="text-gray-600 capitalize">{category}</span>
              <span className="text-gray-800">${amount}</span>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const SummaryResult = ({ data }) => (
  <div className="bg-gray-50 rounded-lg p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Generated Summary</h3>
    <p className="text-gray-800 leading-relaxed">
      Your trip to {data.destination || 'this amazing destination'} sounds incredible! 
      Based on your experiences, it was a perfect blend of adventure and relaxation. 
      The highlights you mentioned create a wonderful story of discovery and memorable moments. 
      This travel log captures the essence of what makes travel so special - the unique experiences, 
      local connections, and personal growth that comes from exploring new places.
    </p>
  </div>
);

export default AIAssistantPage;