/**
 * Mock service for prototyping the labor description generator
 */

const MOCK_MODELS = {
    models: [
        {
            name: 'llama2',
            digest: 'sha256:78e26419b446',
            size: 3800000000,
            modified_at: '2024-03-19T00:00:00Z'
        },
        {
            name: 'deepseek-r1',
            digest: 'sha256:ea35dfe18182',
            size: 9000000000,
            modified_at: '2024-03-16T00:00:00Z'
        },
        {
            name: 'qwen2.5-coder',
            digest: 'sha256:2b0496514337',
            size: 4700000000,
            modified_at: '2024-03-14T00:00:00Z'
        },
        {
            name: 'qwen2.5',
            digest: 'sha256:845dbda0ea48',
            size: 4700000000,
            modified_at: '2024-03-14T00:00:00Z'
        },
        {
            name: 'deepseek-coder',
            digest: 'sha256:3b417b786925',
            size: 776000000,
            modified_at: '2024-03-07T00:00:00Z'
        },
        {
            name: 'phi3.5',
            digest: 'sha256:61819fb370a3',
            size: 2200000000,
            modified_at: '2024-01-19T00:00:00Z'
        }
    ]
};

const MOCK_RESPONSES = [
    `• Successfully replaced LCD back cover to resolve screen separation issue
• Secured all hinge mounting points to restore proper screen stability
• Verified smooth operation of screen movement after repair
• Completed final quality check confirming proper alignment and function`,

    `• Completed replacement of damaged LCD back cover assembly
• Restored hinge mounting points to manufacturer specifications
• Confirmed proper screen alignment and tension after repair
• Validated full range of motion with no signs of separation`,

    `• Installed new LCD back cover to address screen and hinge issues
• Secured all mounting points to ensure stable screen operation
• Tested and confirmed proper screen movement and alignment
• Completed repair with full restoration of screen functionality`
];

class MockService {
    constructor() {
        // Initialize with already installed models to match your Ollama setup
        this.installedModels = [
            'llama2',
            'deepseek-r1',
            'qwen2.5-coder',
            'qwen2.5',
            'deepseek-coder',
            'phi3.5'
        ];
        this.currentModel = 'llama2'; // Set default model
    }

    setModel(modelName) {
        if (!this.installedModels.includes(modelName)) {
            throw new Error(`Model ${modelName} is not installed. Please pull it first.`);
        }
        this.currentModel = modelName;
    }

    async generateDescription(input) {
        if (!this.currentModel || !this.installedModels.includes(this.currentModel)) {
            throw new Error(`No model selected or model not installed. Please select a model first.`);
        }

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Return a random mock response
        return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
    }

    async checkAvailability() {
        // In design mode, we'll simulate Ollama being available
        return true;
    }

    async getAvailableModels() {
        // Return installed models in Ollama format
        return this.installedModels;
    }

    async listModels() {
        // Return all available models in Ollama format
        return MOCK_MODELS;
    }

    // Helper method to simulate pulling a model
    async pullModel(modelName) {
        const model = MOCK_MODELS.models.find(m => m.name === modelName);
        if (!model) {
            throw new Error(`Model ${modelName} not found`);
        }

        // Simulate download delay based on model size
        const sizeInGB = model.size / 1000000000;
        await new Promise(resolve => setTimeout(resolve, sizeInGB * 1000));

        if (!this.installedModels.includes(modelName)) {
            this.installedModels.push(modelName);
        }
        return true;
    }

    // Helper method to simulate removing a model
    async removeModel(modelName) {
        const index = this.installedModels.indexOf(modelName);
        if (index > -1) {
            this.installedModels.splice(index, 1);
        }
        return true;
    }
}

export const mockService = new MockService(); 