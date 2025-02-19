/**
 * Mock service for simulating LangChain functionality in design mode
 */

const MOCK_MODELS = [
  'llama2',
  'mistral',
  'codellama',
  'neural-chat',
  'starling-lm',
];

const MOCK_RESPONSES = [
  `• Performed comprehensive system maintenance to enhance computer performance and security
• Updated critical software components and installed latest security patches
• Optimized system settings for faster operation and better user experience`,

  `• Resolved network connectivity issues affecting remote work capabilities
• Configured secure VPN access for enhanced data protection
• Streamlined file sharing system for improved team collaboration`,

  `• Upgraded hardware components to boost system performance
• Implemented automated backup solution for data protection
• Installed and configured new productivity software tools`,
];

class MockLangChainService {
  private model: string;

  constructor(modelName: string = 'llama2') {
    this.model = modelName;
  }

  /**
   * Set the model to use for generation
   */
  setModel(modelName: string) {
    this.model = modelName;
  }

  /**
   * Generate a mock labor description
   */
  async generateDescription(input: string): Promise<string> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a random mock response
    return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
  }

  /**
   * Mock check if Ollama is available
   */
  async checkAvailability(): Promise<boolean> {
    return true;
  }

  /**
   * Get list of mock available models
   */
  async getAvailableModels(): Promise<string[]> {
    return MOCK_MODELS;
  }
}

export const langChainService = new MockLangChainService(); 