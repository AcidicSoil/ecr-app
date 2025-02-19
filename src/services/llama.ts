import { LlamaModel, LlamaContext, LlamaChatSession } from 'node-llama-cpp';

// Initialize LLaMA model
const MODEL_PATH = './models/llama-2-7b-chat.gguf';

class LlamaService {
  private model: LlamaModel | null = null;
  private context: LlamaContext | null = null;
  private session: LlamaChatSession | null = null;

  async initialize() {
    try {
      this.model = new LlamaModel({
        modelPath: MODEL_PATH,
        contextSize: 4096,
        gpuLayers: 0 // Set to higher number if GPU is available
      });

      this.context = new LlamaContext({ model: this.model });
      this.session = new LlamaChatSession({ context: this.context });
      
      return true;
    } catch (error) {
      console.error('Failed to initialize LLaMA:', error);
      return false;
    }
  }

  async getServiceRecommendations(query: string): Promise<string> {
    if (!this.session) {
      throw new Error('LLaMA service not initialized');
    }

    const prompt = `As an IT service expert, analyze this request and suggest relevant services: "${query}"`;
    
    try {
      const response = await this.session.prompt(prompt);
      return response;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return 'Unable to generate recommendations at this time.';
    }
  }

  async analyzePricing(services: string[]): Promise<string> {
    if (!this.session) {
      throw new Error('LLaMA service not initialized');
    }

    const prompt = `Analyze these IT services and suggest optimal pricing and potential bundles: ${services.join(', ')}`;
    
    try {
      const response = await this.session.prompt(prompt);
      return response;
    } catch (error) {
      console.error('Error analyzing pricing:', error);
      return 'Unable to analyze pricing at this time.';
    }
  }
}

export const llamaService = new LlamaService(); 