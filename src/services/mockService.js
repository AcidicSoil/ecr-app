/**
 * Mock service for prototyping the labor description generator
 */

const MOCK_MODELS = {
    models: [
        {
            name: 'llama2:latest',
            digest: 'sha256:78e26419b446',
            size: 3800000000,
            modified_at: '2024-03-19T00:00:00Z'
        },
        {
            name: 'deepseek-r1:14b',
            digest: 'sha256:ea35dfe18182',
            size: 9000000000,
            modified_at: '2024-03-16T00:00:00Z'
        },
        {
            name: 'llama2:7b',
            digest: 'sha256:78e26419b446',
            size: 3800000000,
            modified_at: '2024-03-16T00:00:00Z'
        },
        {
            name: 'sammcj/qwen2.5-coder-7b-instruct:q8_0',
            digest: 'sha256:4627e24f85f0',
            size: 8100000000,
            modified_at: '2024-03-16T00:00:00Z'
        },
        {
            name: 'bsahane/Qwen2.5-VL-7B-Instruct:Q4_K_M_benxh',
            digest: 'sha256:dccd480cacac',
            size: 4700000000,
            modified_at: '2024-03-16T00:00:00Z'
        },
        {
            name: 'llama3:8b',
            digest: 'sha256:365c0bd3c000',
            size: 4700000000,
            modified_at: '2024-03-14T00:00:00Z'
        },
        {
            name: 'deepseek-r1:1.5b',
            digest: 'sha256:6d3abb8d2d53',
            size: 986000000,
            modified_at: '2024-03-14T00:00:00Z'
        },
        {
            name: 'qwen2.5-coder:latest',
            digest: 'sha256:2b0496514337',
            size: 4700000000,
            modified_at: '2024-03-14T00:00:00Z'
        },
        {
            name: 'qwen2.5:7b',
            digest: 'sha256:845dbda0ea48',
            size: 4700000000,
            modified_at: '2024-03-14T00:00:00Z'
        },
        {
            name: 'qwen2.5:latest',
            digest: 'sha256:845dbda0ea48',
            size: 4700000000,
            modified_at: '2024-03-14T00:00:00Z'
        },
        {
            name: 'deepseek-coder:base',
            digest: 'sha256:3b417b786925',
            size: 776000000,
            modified_at: '2024-03-07T00:00:00Z'
        },
        {
            name: 'deepseek-r1:latest',
            digest: 'sha256:0a8c26691023',
            size: 4700000000,
            modified_at: '2024-03-07T00:00:00Z'
        },
        {
            name: 'hf.co/MaziyarPanahi/Qwen2.5-7B-Instruct-GGUF:IQ1_M',
            digest: 'sha256:b6a58b228f8d',
            size: 2000000000,
            modified_at: '2024-01-19T00:00:00Z'
        },
        {
            name: 'vitali87/shell-commands-qwen2-1.5b-q8_0-extended:latest',
            digest: 'sha256:483edcaac98a',
            size: 1600000000,
            modified_at: '2024-01-19T00:00:00Z'
        },
        {
            name: 'phi3.5:latest',
            digest: 'sha256:61819fb370a3',
            size: 2200000000,
            modified_at: '2024-01-19T00:00:00Z'
        }
    ]
};

class MockService {
    constructor() {
        // Initialize with already installed models to match your Ollama setup
        this.installedModels = [
            'llama2:latest',
            'deepseek-r1:14b',
            'llama2:7b',
            'sammcj/qwen2.5-coder-7b-instruct:q8_0',
            'bsahane/Qwen2.5-VL-7B-Instruct:Q4_K_M_benxh',
            'llama3:8b',
            'deepseek-r1:1.5b',
            'qwen2.5-coder:latest',
            'qwen2.5:7b',
            'qwen2.5:latest',
            'deepseek-coder:base',
            'deepseek-r1:latest',
            'hf.co/MaziyarPanahi/Qwen2.5-7B-Instruct-GGUF:IQ1_M',
            'vitali87/shell-commands-qwen2-1.5b-q8_0-extended:latest',
            'phi3.5:latest'
        ];
        this.currentModel = 'deepseek-r1:latest'; // Set default model
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

        // Extract key information from input
        const inputLower = input.toLowerCase();
        const actions = [];

        // Analyze the input to determine the type of work and key details
        if ((inputLower.includes('no display')) || (inputLower.includes('display') && inputLower.includes('issue'))) {
            actions.push(`• Diagnosed and identified display connectivity issue`);
            if (inputLower.includes('ram')) {
                actions.push(`• Located faulty RAM module through systematic testing`);
                actions.push(`• Removed defective memory component and validated system stability`);
            }
            if (inputLower.includes('gpu') || inputLower.includes('graphics')) {
                actions.push(`• Verified GPU functionality through dedicated testing procedures`);
            }
        } else if (inputLower.includes('windows') && (inputLower.includes('install') || inputLower.includes('reset'))) {
            actions.push(`• Performed clean Windows installation on system`);
            actions.push(`• Configured system settings and removed unnecessary software`);
            actions.push(`• Installed essential drivers and security updates`);
        } else if (inputLower.includes('virus') || inputLower.includes('malware')) {
            actions.push(`• Executed comprehensive malware scanning and removal`);
            actions.push(`• Cleaned infected system files and removed security threats`);
            actions.push(`• Updated system protection and security measures`);
        }

        // If no specific actions were added, add relevant details from the input
        if (actions.length === 0) {
            const mainIssue = input.split('|')[0].trim();
            actions.push(`• Diagnosed and addressed: ${mainIssue}`);
            actions.push(`• Performed necessary system repairs and adjustments`);
            actions.push(`• Verified resolution of reported issues`);
        }

        // Always add a final verification step
        actions.push(`• Completed final quality assurance testing`);

        return actions.join('\n');
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