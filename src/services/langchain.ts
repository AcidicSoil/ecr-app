import { ChatOllama } from 'langchain/chat_models/ollama';
import { PromptTemplate } from 'langchain/prompts';
import { StringOutputParser } from 'langchain/schema/output_parser';
import { RunnableSequence } from 'langchain/schema/runnable';
import { z } from 'zod';

// Define the schema for labor description output
const LaborDescriptionSchema = z.object({
  description: z.string(),
  bulletPoints: z.array(z.string()),
  technicalTerms: z.array(z.string()),
});

type LaborDescription = z.infer<typeof LaborDescriptionSchema>;

const SYSTEM_TEMPLATE = `You are an IT service professional who writes clear, concise labor descriptions for customers.
Your task is to create customer-friendly descriptions of technical work performed.
Focus on value delivered and use simple language while maintaining accuracy.`;

const USER_TEMPLATE = `Create a clear and concise labor description for the following work:
{input}

The description should:
- Be written for a non-technical audience
- Use specific details from the work performed
- Be formatted in bullet points
- Keep under 100 words
- Focus on the value provided to the customer
- Include any relevant technical terms in a customer-friendly way

Format the response as bullet points, starting each point with "• ".`;

class LangChainService {
  private model: ChatOllama;
  private prompt: PromptTemplate;
  private chain: RunnableSequence;

  constructor(modelName: string = 'llama2') {
    this.model = new ChatOllama({
      baseUrl: 'http://localhost:11434',
      model: modelName,
      temperature: 0.7,
    });

    this.prompt = PromptTemplate.fromTemplate(USER_TEMPLATE);
    
    // Create the chain
    this.chain = RunnableSequence.from([
      this.prompt,
      this.model,
      new StringOutputParser(),
    ]);
  }

  /**
   * Set the model to use for generation
   */
  setModel(modelName: string) {
    this.model = new ChatOllama({
      baseUrl: 'http://localhost:11434',
      model: modelName,
      temperature: 0.7,
    });
  }

  /**
   * Generate a labor description using the configured model
   */
  async generateDescription(input: string): Promise<string> {
    try {
      const response = await this.chain.invoke({
        input,
      });

      return response;
    } catch (error) {
      console.error('Error generating description:', error);
      throw error;
    }
  }

  /**
   * Check if Ollama is available
   */
  async checkAvailability(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get list of available models
   */
  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      if (!response.ok) return [];
      
      const data = await response.json();
      return data.models?.map((model: any) => model.name) || [];
    } catch {
      return [];
    }
  }
}

export const langChainService = new LangChainService(); 