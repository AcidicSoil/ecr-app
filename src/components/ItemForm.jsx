import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import TextField from '@mui/material/TextField';
import { Box, Container, IconButton, Button, FormControlLabel, Checkbox, Card, CardContent } from '@mui/material';
import { useTransition, animated } from '@react-spring/web';

function ItemForm({ items, setItems, onCalculateWeightedSum }) {
  const [includeHardware, setIncludeHardware] = useState(() => {
    return JSON.parse(localStorage.getItem('includeHardware')) || false;
  });
  const [includeSoftware, setIncludeSoftware] = useState(() => {
    return JSON.parse(localStorage.getItem('includeSoftware')) || false;
  });
  const [hardwareHours, setHardwareHours] = useState(() => {
    return parseInt(localStorage.getItem('hardwareHours')) || 1;
  });
  const [softwareHours, setSoftwareHours] = useState(() => {
    return parseInt(localStorage.getItem('softwareHours')) || 1;
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    localStorage.setItem('includeHardware', JSON.stringify(includeHardware));
  }, [includeHardware]);

  useEffect(() => {
    localStorage.setItem('includeSoftware', JSON.stringify(includeSoftware));
  }, [includeSoftware]);

  useEffect(() => {
    localStorage.setItem('hardwareHours', hardwareHours.toString());
  }, [hardwareHours]);

  useEffect(() => {
    localStorage.setItem('softwareHours', softwareHours.toString());
  }, [softwareHours]);

  const itemTransitions = useTransition(items, {
    from: { opacity: 0, transform: 'translateY(20px)' },
    enter: { opacity: 1, transform: 'translateY(0px)' },
    leave: { opacity: 0, transform: 'translateY(-20px)' },
    keys: item => item.id,
  });

  const validateInput = useCallback((type, value) => {
    if (type === 'number') {
      if (value === '') return '';
      const num = parseFloat(value);
      if (isNaN(num) || num < 0) return 'Price must be a positive number';
    } else if (type === 'quantity') {
      const num = parseInt(value, 10);
      if (isNaN(num) || num < 1) return 'Quantity must be at least 1';
    }
    return '';
  }, []);

  const handleChange = useCallback((id, type, value) => {
    const error = validateInput(type, value);
    setErrors(prev => ({ ...prev, [id]: { ...prev[id], [type]: error } }));

    setItems(prevItems => prevItems.map(item => {
      if (item.id === id) {
        return { ...item, [type]: value };
      }
      return item;
    }));
  }, [validateInput, setItems]);

  const handleAddItem = () => {
    const newId = Date.now();
    setItems(prev => [...prev, { id: newId, number: '', quantity: 1 }]);
    setErrors(prev => ({ ...prev, [newId]: {} }));
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasErrors = Object.values(errors).some(itemErrors => 
      Object.values(itemErrors).some(error => error !== '')
    );
    if (hasErrors) {
      alert('Please correct the errors before submitting.');
      return;
    }
    if (items.some(item => item.number === '')) {
      alert('Please fill in all price fields before submitting.');
      return;
    }
    onCalculateWeightedSum(items, includeHardware, hardwareHours, includeSoftware, softwareHours);
  };

  return (
    <Container maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        {itemTransitions((styles, item) => (
          <animated.div style={styles}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    label="Price"
                    type="number"
                    value={item.number}
                    onChange={(e) => handleChange(item.id, 'number', e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1, flexGrow: 1 }}
                    inputProps={{ min: 0, step: "0.01" }}
                    error={!!errors[item.id]?.number}
                    helperText={errors[item.id]?.number}
                  />
                  <TextField
                    label="Quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleChange(item.id, 'quantity', e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1, flexGrow: 1 }}
                    inputProps={{ min: 1 }}
                    error={!!errors[item.id]?.quantity}
                    helperText={errors[item.id]?.quantity}
                  />
                  <IconButton onClick={() => handleRemoveItem(item.id)} color="error">
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </animated.div>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={includeHardware}
                onChange={() => setIncludeHardware(!includeHardware)}
              />
            }
            label="Include Hardware Labor"
          />
          {includeHardware && (
            <TextField
              label="Hours"
              type="number"
              value={hardwareHours}
              onChange={(e) => setHardwareHours(Math.max(1, parseInt(e.target.value, 10)))}
              variant="outlined"
              size="small"
              sx={{ ml: 2 }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={includeSoftware}
                onChange={() => setIncludeSoftware(!includeSoftware)}
              />
            }
            label="Include Software Labor"
          />
          {includeSoftware && (
            <TextField
              label="Hours"
              type="number"
              value={softwareHours}
              onChange={(e) => setSoftwareHours(Math.max(1, parseInt(e.target.value, 10)))}
              variant="outlined"
              size="small"
              sx={{ ml: 2 }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleAddItem}
          >
            Add Item
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
          >
            Calculate
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

ItemForm.propTypes = {
  items: PropTypes.array.isRequired,
  setItems: PropTypes.func.isRequired,
  onCalculateWeightedSum: PropTypes.func.isRequired,
};

export default ItemForm;