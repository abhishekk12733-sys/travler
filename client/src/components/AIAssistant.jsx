import { useState } from 'react';
import { Sparkles, Map, Package, DollarSign, Loader } from 'lucide-react';

const AIAssistant = () => {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [itineraryForm, setItineraryForm] = useState({
    destination: '',
    days: '',
    budget: 'medium'
  });

  const [packingForm, setPackingForm] = useState({
    destination: '',
    duration: '',
    season: 'summer'
  });

  const [budgetForm, setBudgetForm] = useState({
    destination: '',
    duration: '',
    travelStyle: 'budget'
  });

  const generateItinerary = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setResult({
        type: 'itinerary',
        data: {
          title: `${itineraryForm.days}-Day Trip to ${itineraryForm.destination}`,
          days: Array.from({ length: parseInt(itineraryForm.days) }, (_, i) => ({
            day: i + 1,
            activities: [
              `Morning: Explore local markets and try traditional breakfast`,
              `Afternoon: Visit iconic landmarks and cultural sites`,
              `Evening: Sunset viewing point and local cuisine dinner`
            ]
          }))
        }
      });
      setLoading(false);
    }, 2000);
  };

  const generatePackingList = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setResult({
        type: 'packing',
        data: {
          title: `Packing List for ${packingForm.destination}`,
          categories: [
            {
              name: 'Clothing',
              items: ['T-shirts (5)', 'Pants/Shorts (3)', 'Jacket', 'Comfortable shoes', 'Flip flops']
            },
            {
              name: 'Essentials',
              items: ['Passport', 'Travel insurance', 'Chargers', 'Medications', 'Sunscreen']
            },
            {
              name: 'Electronics',
              items: ['Phone', 'Camera', 'Power bank', 'Headphones', 'Travel adapter']
            },
            {
              name: 'Toiletries',
              items: ['Toothbrush', 'Toothpaste', 'Shampoo', 'Soap', 'Deodorant']
            }
          ]
        }
      });
      setLoading(false);
    }, 2000);
  };

  const estimateBudget = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const baseDaily = budgetForm.travelStyle === 'luxury' ? 200 : budgetForm.travelStyle === 'medium' ? 80 : 35;
      const total = baseDaily * parseInt(budgetForm.duration);

      setResult({
        type: 'budget',
        data: {
          title: `${budgetForm.travelStyle.charAt(0).toUpperCase() + budgetForm.travelStyle.slice(1)} Budget for ${budgetForm.destination}`,
          total: total,
          breakdown: [
            { category: 'Accommodation', amount: total * 0.35, percent: 35 },
            { category: 'Food & Dining', amount: total * 0.25, percent: 25 },
            { category: 'Transportation', amount: total * 0.20, percent: 20 },
            { category: 'Activities', amount: total * 0.15, percent: 15 },
            { category: 'Miscellaneous', amount: total * 0.05, percent: 5 }
          ]
        }
      });
      setLoading(false);
    }, 2000);
  };

  const tabs = [
    { id: 'itinerary', name: 'Itinerary Generator', icon: Map },
    { id: 'packing', name: 'Packing List', icon: Package },
    { id: 'budget', name: 'Budget Estimator', icon: DollarSign }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={32} />
            <h1 className="text-4xl font-bold">AI Travel Assistant</h1>
          </div>
          <p className="text-white/90 text-lg">Let AI help plan your perfect journey</p>
        </div>

        <div className="bg-white">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setResult(null);
                  }}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  {tab.name}
                </button>
              );
            })}
          </div>

          <div className="p-8">
            {activeTab === 'itinerary' && (
              <form onSubmit={generateItinerary} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination
                  </label>
                  <input
                    type="text"
                    value={itineraryForm.destination}
                    onChange={(e) => setItineraryForm({ ...itineraryForm, destination: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g., Bali, Indonesia"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Days
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={itineraryForm.days}
                      onChange={(e) => setItineraryForm({ ...itineraryForm, days: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="5"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Level
                    </label>
                    <select
                      value={itineraryForm.budget}
                      onChange={(e) => setItineraryForm({ ...itineraryForm, budget: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="budget">Budget</option>
                      <option value="medium">Medium</option>
                      <option value="luxury">Luxury</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Generate Itinerary
                    </>
                  )}
                </button>
              </form>
            )}

            {activeTab === 'packing' && (
              <form onSubmit={generatePackingList} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination
                  </label>
                  <input
                    type="text"
                    value={packingForm.destination}
                    onChange={(e) => setPackingForm({ ...packingForm, destination: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g., Iceland"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trip Duration (days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={packingForm.duration}
                      onChange={(e) => setPackingForm({ ...packingForm, duration: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="7"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Season
                    </label>
                    <select
                      value={packingForm.season}
                      onChange={(e) => setPackingForm({ ...packingForm, season: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="summer">Summer</option>
                      <option value="winter">Winter</option>
                      <option value="spring">Spring</option>
                      <option value="fall">Fall</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Package size={20} />
                      Generate Packing List
                    </>
                  )}
                </button>
              </form>
            )}

            {activeTab === 'budget' && (
              <form onSubmit={estimateBudget} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination
                  </label>
                  <input
                    type="text"
                    value={budgetForm.destination}
                    onChange={(e) => setBudgetForm({ ...budgetForm, destination: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g., Paris, France"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trip Duration (days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={budgetForm.duration}
                      onChange={(e) => setBudgetForm({ ...budgetForm, duration: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="10"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Travel Style
                    </label>
                    <select
                      value={budgetForm.travelStyle}
                      onChange={(e) => setBudgetForm({ ...budgetForm, travelStyle: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="budget">Budget Backpacking</option>
                      <option value="medium">Comfortable Travel</option>
                      <option value="luxury">Luxury Experience</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <DollarSign size={20} />
                      Estimate Budget
                    </>
                  )}
                </button>
              </form>
            )}

            {result && (
              <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl border border-blue-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{result.data.title}</h3>

                {result.type === 'itinerary' && (
                  <div className="space-y-4">
                    {result.data.days.map(day => (
                      <div key={day.day} className="bg-white p-4 rounded-lg shadow">
                        <h4 className="font-bold text-lg text-blue-600 mb-2">Day {day.day}</h4>
                        <ul className="space-y-2">
                          {day.activities.map((activity, idx) => (
                            <li key={idx} className="text-gray-700 flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {result.type === 'packing' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.data.categories.map(category => (
                      <div key={category.name} className="bg-white p-4 rounded-lg shadow">
                        <h4 className="font-bold text-lg text-teal-600 mb-2">{category.name}</h4>
                        <ul className="space-y-1">
                          {category.items.map((item, idx) => (
                            <li key={idx} className="text-gray-700 flex items-center">
                              <input type="checkbox" className="mr-2" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {result.type === 'budget' && (
                  <div>
                    <div className="bg-white p-6 rounded-lg shadow mb-4 text-center">
                      <p className="text-gray-600 mb-2">Estimated Total Budget</p>
                      <p className="text-4xl font-bold text-green-600">${result.data.total.toFixed(2)}</p>
                    </div>
                    <div className="space-y-3">
                      {result.data.breakdown.map(item => (
                        <div key={item.category} className="bg-white p-4 rounded-lg shadow">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-800">{item.category}</span>
                            <span className="font-bold text-gray-800">${item.amount.toFixed(2)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full"
                              style={{ width: `${item.percent}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
