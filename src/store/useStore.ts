import { create } from 'zustand'

export interface Service {
  id: number
  name: string
  category: string
  basePrice: number
}

export interface LaborOptions {
  includeHardware: boolean
  includeSoftware: boolean
}

export interface Recommendations {
  services: string
  pricing: string
}

interface QuoteStore {
  // State
  services: Service[]
  selectedServices: string[]
  searchQuery: string
  selectedCategory: string
  laborOptions: LaborOptions
  recommendations: Recommendations
  
  // Actions
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string) => void
  toggleService: (serviceName: string) => void
  updateLaborOptions: (options: Partial<LaborOptions>) => void
  setRecommendations: (recommendations: Partial<Recommendations>) => void
  calculateTotal: () => number
}

// Initial services data
const INITIAL_SERVICES: Service[] = [
  { id: 1, name: 'Network Setup', category: 'Infrastructure', basePrice: 500 },
  { id: 2, name: 'Server Configuration', category: 'Infrastructure', basePrice: 800 },
  { id: 3, name: 'Cloud Migration', category: 'Cloud', basePrice: 1500 },
  { id: 4, name: 'Security Audit', category: 'Security', basePrice: 1200 },
  { id: 5, name: 'Data Backup Solution', category: 'Data', basePrice: 600 },
];

export const useStore = create<QuoteStore>((set, get) => ({
  // Initial state
  services: INITIAL_SERVICES,
  selectedServices: [],
  searchQuery: '',
  selectedCategory: 'All',
  laborOptions: {
    includeHardware: false,
    includeSoftware: false,
  },
  recommendations: {
    services: '',
    pricing: '',
  },

  // Actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  toggleService: (serviceName) => set((state) => ({
    selectedServices: state.selectedServices.includes(serviceName)
      ? state.selectedServices.filter(name => name !== serviceName)
      : [...state.selectedServices, serviceName]
  })),
  
  updateLaborOptions: (options) => set((state) => ({
    laborOptions: { ...state.laborOptions, ...options }
  })),
  
  setRecommendations: (recommendations) => set((state) => ({
    recommendations: { ...state.recommendations, ...recommendations }
  })),
  
  calculateTotal: () => {
    const state = get();
    const baseTotal = state.selectedServices.reduce((sum, serviceName) => {
      const service = state.services.find(s => s.name === serviceName);
      return sum + (service?.basePrice || 0);
    }, 0);

    const hardwareMultiplier = state.laborOptions.includeHardware ? 1.4 : 1;
    const softwareMultiplier = state.laborOptions.includeSoftware ? 1.3 : 1;

    return baseTotal * hardwareMultiplier * softwareMultiplier;
  },
})); 