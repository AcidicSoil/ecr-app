import React, { useEffect, useState } from 'react';
import { llamaService } from '../services/llama';
import { useStore } from '../store/useStore';

const ServiceRecommendations: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    searchQuery,
    selectedServices,
    recommendations,
    setRecommendations
  } = useStore();

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!searchQuery) return;
      
      setLoading(true);
      try {
        const result = await llamaService.getServiceRecommendations(searchQuery);
        setRecommendations({ services: result });
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
      setLoading(false);
    };

    fetchRecommendations();
  }, [searchQuery, setRecommendations]);

  useEffect(() => {
    const analyzePricing = async () => {
      if (selectedServices.length === 0) return;
      
      setLoading(true);
      try {
        const analysis = await llamaService.analyzePricing(selectedServices);
        setRecommendations({ pricing: analysis });
      } catch (error) {
        console.error('Error analyzing pricing:', error);
      }
      setLoading(false);
    };

    analyzePricing();
  }, [selectedServices, setRecommendations]);

  if (loading) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations.services && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Recommended Services</h3>
          <p className="text-blue-700">{recommendations.services}</p>
        </div>
      )}
      
      {recommendations.pricing && (
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">Pricing Analysis</h3>
          <p className="text-green-700">{recommendations.pricing}</p>
        </div>
      )}
    </div>
  );
};

export default ServiceRecommendations; 