# IT Service Quote Generator

A professional application for generating IT service quotes and customer-friendly labor descriptions using local AI models.

## Features

### Quote Generation
- Create detailed IT service quotes with parts and labor
- Automatic markup calculation based on item cost
- Hardware and software labor hour tracking
- PDF quote generation with professional formatting
- Quote history management and tracking

### Labor Description Generator
- AI-powered labor description generation using local Ollama models
- Professional, customer-friendly output
- Support for multiple AI models:
  - llama2
  - deepseek-r1
  - qwen2.5-coder
  - qwen2.5
  - deepseek-coder
  - phi3.5
- Save and manage generated descriptions
- Copy functionality for easy transfer

## Tech Stack

- React
- Next.js
- TypeScript
- TailwindCSS
- Shadcn/UI
- Material-UI (MUI)
- Ollama (Local AI models)

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- [Ollama](https://ollama.ai/) installed and running locally
- At least one compatible language model pulled in Ollama

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ecr-app.git
cd ecr-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Ollama Setup

1. Install Ollama from [ollama.ai](https://ollama.ai)
2. Pull required models:
```bash
ollama pull llama2
ollama pull deepseek-r1
# Add other models as needed
```

3. Ensure Ollama is running:
```bash
ollama serve
```

## Usage

### Quote Generation
1. Enter service items with quantities
2. Add hardware/software labor hours if needed
3. Generate and download PDF quotes
4. Save quotes for future reference

### Labor Description Generation
1. Select an AI model from the dropdown
2. Enter technical work description
3. Click "Generate Description" to create customer-friendly description
4. Copy or save the generated description

## Development

### Design Mode
The application includes a design mode that uses mock data for prototyping:
- Simulated AI model responses
- Mock service integration
- Dummy data for testing

### Adding Components
Use Shadcn/UI CLI to add new components:
```bash
npx shadcn@latest add [component-name]
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Ollama](https://ollama.ai/) for local AI model support
- [Shadcn/UI](https://ui.shadcn.com/) for React components
- [Material-UI](https://mui.com/) for UI components

