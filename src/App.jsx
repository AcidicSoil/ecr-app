import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ItemForm from './components/ItemForm';
import ServiceSearch from './components/ServiceSearch';
import QuoteGenerator from './components/QuoteGenerator';
import CostBreakdown from './components/CostBreakdown';
import QuoteHistory from './components/QuoteHistory.tsx';
import Chatbot from './components/Chatbot';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  IconButton, 
  Tooltip, 
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import './App.css';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [items, setItems] = useState([]);
  const [totalWeightedSum, setTotalWeightedSum] = useState(0);
  const [quoteNumber, setQuoteNumber] = useState('');
  const [includeHardware, setIncludeHardware] = useState(false);
  const [includeSoftware, setIncludeSoftware] = useState(false);
  const [hardwareHours, setHardwareHours] = useState(1);
  const [softwareHours, setSoftwareHours] = useState(1);
  const [quoteHistory, setQuoteHistory] = useState(() => {
    const savedHistory = localStorage.getItem('quoteHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setQuoteNumber(`Q${Date.now().toString().slice(-6)}`);
  }, []);

  useEffect(() => {
    localStorage.setItem('quoteHistory', JSON.stringify(quoteHistory));
  }, [quoteHistory]);

  const handleCopyTotal = () => {
    navigator.clipboard.writeText(totalWeightedSum.toFixed(2))
      .then(() => {
        console.log('Total copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const calculateWeightedSum = (items, includeHardware, hardwareHours, includeSoftware, softwareHours) => {
    let total = items.reduce((sum, item) => {
      const price = parseFloat(item.number);
      const quantity = parseInt(item.quantity, 10);
      let itemTotal = price <= 50 ? price * 2 : price * 1.3;
      return sum + (itemTotal * quantity);
    }, 0);

    if (includeHardware) {
      total += hardwareHours * 129.90;
    }
    if (includeSoftware) {
      total += softwareHours * 120;
    }

    setTotalWeightedSum(total);
  };

  const handleSaveQuote = () => {
    const newQuote = {
      id: quoteNumber,
      date: new Date().toISOString().split('T')[0],
      totalAmount: totalWeightedSum,
      items,
      includeHardware,
      hardwareHours,
      includeSoftware,
      softwareHours
    };
    setQuoteHistory(prev => [newQuote, ...prev]);
    
    // Reset form for next quote
    setItems([]);
    setTotalWeightedSum(0);
    setQuoteNumber(`Q${Date.now().toString().slice(-6)}`);
    setIncludeHardware(false);
    setIncludeSoftware(false);
    setHardwareHours(1);
    setSoftwareHours(1);
  };

  const handleHardwareToggle = () => {
    setIncludeHardware(prev => !prev);
  };

  const handleSoftwareToggle = () => {
    setIncludeSoftware(prev => !prev);
  };

  const handleHardwareHoursChange = (hours) => {
    setHardwareHours(hours);
  };

  const handleSoftwareHoursChange = (hours) => {
    setSoftwareHours(hours); 
  };

  const handleDeleteQuote = (quoteId) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      setQuoteHistory(prev => prev.filter(quote => quote.id !== quoteId));
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="md" className="App">
      <Typography variant="h4" component="h1" gutterBottom>
        IT Service Quote Generator
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label="Quote Generator" />
          <Tab label="Labor Description" />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <ServiceSearch onAddService={(service) => setItems([...items, { ...service, quantity: 1 }])} />

        <ItemForm
          items={items}
          setItems={setItems}
          onCalculateWeightedSum={calculateWeightedSum}
        />

        {totalWeightedSum > 0 && (
          <>
            <Typography variant="h6" component="h3">
              Quote Number: {quoteNumber}
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Typography variant="h5" component="h2">
                Total Cost: ${totalWeightedSum.toFixed(2)}
              </Typography>
              <Tooltip title="Copy total">
                <IconButton onClick={handleCopyTotal} size="small">
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <CostBreakdown
              items={items}
              includeHardware={includeHardware}
              hardwareHours={hardwareHours}
              includeSoftware={includeSoftware}
              softwareHours={softwareHours}
              totalWeightedSum={totalWeightedSum}
              onHardwareToggle={handleHardwareToggle}
              onSoftwareToggle={handleSoftwareToggle}
              onHardwareHoursChange={handleHardwareHoursChange}
              onSoftwareHoursChange={handleSoftwareHoursChange}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
              <PDFDownloadLink
                document={
                  <QuoteGenerator
                    items={items}
                    includeHardware={includeHardware}
                    hardwareHours={hardwareHours}
                    includeSoftware={includeSoftware}
                    softwareHours={softwareHours}
                    totalWeightedSum={totalWeightedSum}
                    quoteNumber={quoteNumber}
                  />
                }
                fileName={`quote_${quoteNumber}.pdf`}
              >
                {({ blob, url, loading, error }) =>
                  loading ? 'Loading document...' : <Button variant="contained">Download Quote PDF</Button>
                }
              </PDFDownloadLink>
              
              <Button 
                variant="contained" 
                color="secondary"
                onClick={handleSaveQuote}
              >
                Save Quote
              </Button>
            </Box>
          </>
        )}

        <Divider sx={{ my: 4 }} />
        
        <QuoteHistory 
          quotes={quoteHistory} 
          onDeleteQuote={handleDeleteQuote}
        />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Chatbot />
      </TabPanel>
    </Container>
  );
}

export default App;