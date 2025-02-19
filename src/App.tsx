import React, { useEffect, useState } from 'react';
import ServiceRecommendations from './components/ServiceRecommendations';
import { llamaService } from './services/llama';
import { useStore } from './store/useStore';

// Dummy data for services
const SERVICES = [
  { id: 1, name: 'Network Setup', category: 'Infrastructure', basePrice: 500 },
  { id: 2, name: 'Server Configuration', category: 'Infrastructure', basePrice: 800 },
  { id: 3, name: 'Cloud Migration', category: 'Cloud', basePrice: 1500 },
  { id: 4, name: 'Security Audit', category: 'Security', basePrice: 1200 },
  { id: 5, name: 'Data Backup Solution', category: 'Data', basePrice: 600 },
];

const CATEGORIES = ['All', 'Infrastructure', 'Cloud', 'Security', 'Data'];

function App() {
  const [isLlamaInitialized, setIsLlamaInitialized] = useState(false);
  const {
    services,
    selectedServices,
    searchQuery,
    selectedCategory,
    laborOptions,
    setSearchQuery,
    setSelectedCategory,
    toggleService,
    updateLaborOptions,
    calculateTotal
  } = useStore();

  useEffect(() => {
    const initializeLlama = async () => {
      const success = await llamaService.initialize();
      setIsLlamaInitialized(success);
    };

    initializeLlama();
  }, []);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">IT Service Quote Generator</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <input
            type="text"
            placeholder="Search Service"
            className="w-full p-2 border rounded mb-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            {filteredServices.map(service => (
              <div key={service.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedServices.includes(service.name)}
                  onChange={() => toggleService(service.name)}
                  className="mr-2"
                />
                <span>{service.name} - ${service.basePrice}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={laborOptions.includeHardware}
                onChange={(e) => updateLaborOptions({ includeHardware: e.target.checked })}
                className="mr-2"
              />
              <span>Include Hardware Labor (+40%)</span>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={laborOptions.includeSoftware}
                onChange={(e) => updateLaborOptions({ includeSoftware: e.target.checked })}
                className="mr-2"
              />
              <span>Include Software Labor (+30%)</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => {/* Add item logic */}}
            >
              ADD ITEM
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-4"
            >
              CALCULATE
            </button>
          </div>
        </div>

        {isLlamaInitialized && <ServiceRecommendations />}

        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Total Quote</h2>
          <p className="text-2xl font-bold text-green-600">${calculateTotal().toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default App; 