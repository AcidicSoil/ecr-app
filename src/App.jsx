import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ItemForm from './components/ItemForm';
import ServiceSearch from './components/ServiceSearch';
import QuoteGenerator from './components/QuoteGenerator';
import CostBreakdown from './components/CostBreakdown';
import { Container, Typography, Box, Button, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [totalWeightedSum, setTotalWeightedSum] = useState(0);
  const [quoteNumber, setQuoteNumber] = useState('');
  const [includeHardware, setIncludeHardware] = useState(false);
  const [includeSoftware, setIncludeSoftware] = useState(false);
  const [hardwareHours, setHardwareHours] = useState(1);
  const [softwareHours, setSoftwareHours] = useState(1);

  useEffect(() => {
    setQuoteNumber(`Q${Date.now().toString().slice(-6)}`);
  }, []);

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

  return (
    <Container maxWidth="md" className="App">
      <Typography variant="h4" component="h1" gutterBottom>
        IT Service Quote Generator
      </Typography>

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
        </>
      )}
    </Container>
  );
}

export default App;