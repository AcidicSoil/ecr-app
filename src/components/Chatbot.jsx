import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  LinearProgress,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import { mockService } from '../services/mockService';

function Chatbot() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [model, setModel] = useState('');
  const [availableModels, setAvailableModels] = useState([]);
  const [allModels, setAllModels] = useState([]);
  const [isOllamaAvailable, setIsOllamaAvailable] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [currentInstall, setCurrentInstall] = useState('');
  const [error, setError] = useState('');
  const [savedDescriptions, setSavedDescriptions] = useState(() => {
    const saved = localStorage.getItem('laborDescriptions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const checkOllama = async () => {
      const available = await mockService.checkAvailability();
      setIsOllamaAvailable(available);
      if (available) {
        const models = await mockService.getAvailableModels();
        setAvailableModels(models);
        const allModelsResponse = await mockService.listModels();
        setAllModels(allModelsResponse.models);
      }
    };
    checkOllama();
  }, []);

  const handleInstallModel = async (modelName) => {
    setInstalling(true);
    setCurrentInstall(modelName);
    setError('');
    
    try {
      await mockService.pullModel(modelName);
      const models = await mockService.getAvailableModels();
      setAvailableModels(models);
      setModel(modelName);
    } catch (error) {
      console.error('Error installing model:', error);
      setError(`Failed to install ${modelName}: ${error.message}`);
    }
    
    setInstalling(false);
    setCurrentInstall('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !isOllamaAvailable) return;

    setLoading(true);
    setError('');
    try {
      mockService.setModel(model);
      const response = await mockService.generateDescription(input);
      setDescription(response);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
    setLoading(false);
  };

  const handleSave = () => {
    if (!description) return;
    
    const newDescription = {
      id: Date.now(),
      text: description,
      workDescription: input,
      date: new Date().toISOString(),
      model,
    };
    
    const updatedDescriptions = [newDescription, ...savedDescriptions];
    setSavedDescriptions(updatedDescriptions);
    localStorage.setItem('laborDescriptions', JSON.stringify(updatedDescriptions));
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Paper 
        sx={{ 
          p: 3, 
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Labor Description Generator
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Describe the work performed and get a customer-friendly labor description using local AI models.
        </Typography>

        {!isOllamaAvailable && (
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 2,
              bgcolor: 'warning.dark',
              color: 'warning.contrastText',
            }}
          >
            Ollama is not available. Please make sure it's running on your system.
          </Alert>
        )}

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              bgcolor: 'error.dark',
              color: 'error.contrastText',
            }}
          >
            {error}
          </Alert>
        )}

        {isOllamaAvailable && availableModels.length === 0 && (
          <Alert 
            severity="info" 
            icon={<InfoIcon />}
            sx={{ 
              mb: 2,
              bgcolor: 'info.dark',
              color: 'info.contrastText',
            }}
          >
            No models installed. Click a model below to install:
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {allModels.map((model) => (
                <Button
                  key={model.name}
                  variant="outlined"
                  size="small"
                  disabled={installing}
                  onClick={() => handleInstallModel(model.name)}
                  startIcon={<DownloadIcon />}
                  sx={{
                    color: 'primary.light',
                    borderColor: 'primary.light',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  {model.name.toUpperCase()}
                </Button>
              ))}
            </Box>
            {installing && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Installing {currentInstall}...
                </Typography>
                <LinearProgress sx={{ bgcolor: 'background.paper' }} />
              </Box>
            )}
          </Alert>
        )}

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="model-select-label">Model</InputLabel>
          <Select
            labelId="model-select-label"
            value={model}
            label="Model"
            onChange={(e) => setModel(e.target.value)}
            disabled={!isOllamaAvailable || availableModels.length === 0 || installing}
            sx={{
              bgcolor: 'background.paper',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'divider',
              },
            }}
          >
            {availableModels.map((m) => (
              <MenuItem key={m} value={m}>{m.toUpperCase()}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Describe the technical work performed..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            sx={{ 
              mb: 2,
              bgcolor: 'background.paper',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'divider',
              },
            }}
            disabled={!isOllamaAvailable || availableModels.length === 0 || installing}
          />
          <Button
            variant="contained"
            type="submit"
            disabled={loading || !input.trim() || !isOllamaAvailable || availableModels.length === 0 || installing}
            endIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
            sx={{
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            Generate Description
          </Button>
        </form>

        {description && (
          <Card 
            sx={{ 
              mt: 3,
              bgcolor: 'background.paper',
              color: 'text.primary',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" color="primary.light">
                  Generated Description
                </Typography>
                <Box>
                  <Tooltip title="Copy description">
                    <IconButton onClick={() => handleCopy(description)} size="small" sx={{ color: 'primary.light' }}>
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Save description">
                    <IconButton onClick={handleSave} size="small" sx={{ ml: 1, color: 'primary.light' }}>
                      <SaveIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Generated using {model}
              </Typography>
              <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-line' }}>
                {description}
              </Typography>
            </CardContent>
          </Card>
        )}

        {savedDescriptions.length > 0 && (
          <>
            <Divider sx={{ my: 4, bgcolor: 'divider' }} />
            <Typography variant="h6" gutterBottom>
              Saved Descriptions
            </Typography>
            <Box sx={{ mt: 2 }}>
              {savedDescriptions.map((saved) => (
                <Card 
                  key={saved.id} 
                  sx={{ 
                    mb: 2,
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                  }}
                >
                  <CardContent>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                      {new Date(saved.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Work performed: {saved.workDescription}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Model used: {saved.model}
                    </Typography>
                    <Typography variant="body1">
                      {saved.text}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                      <Tooltip title="Copy description">
                        <IconButton onClick={() => handleCopy(saved.text)} size="small" sx={{ color: 'primary.light' }}>
                          <ContentCopyIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}

export default Chatbot;