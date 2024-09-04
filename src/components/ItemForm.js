import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box, Container, FormControlLabel, Checkbox } from '@mui/material';
import IconButton from '@mui/material/IconButton';

function ItemForm({ onCalculateWeightedSum }) {
  const [items, setItems] = useState([{ number: '', quantity: 1 }]);
  const [includeHardware, setIncludeHardware] = useState(false);
  const [includeSoftware, setIncludeSoftware] = useState(false);

  const handleAddItem = () => {
    setItems([...items, { number: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleChange = (index, type, value) => {
    const validValue = type === 'number' ? Math.max(0, Number(value)) : Math.max(1, parseInt(value, 10));

    const newItems = items.map((item, i) => {
      if (i === index) {
        return { ...item, [type]: validValue };
      }
      return item;
    });
    setItems(newItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculateWeightedSum(items, includeHardware, includeSoftware);
  };

  return (
    <Container maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        {items.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              label="Price"
              type="number"
              value={item.number}
              onChange={(e) => handleChange(index, 'number', e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mr: 1 }}
            />
            <TextField
              label="Quantity"
              type="number"
              value={item.quantity}
              onChange={(e) => handleChange(index, 'quantity', e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mr: 1 }}
            />
            <IconButton onClick={() => handleRemoveItem(index)} color="error">
              <RemoveCircleOutlineIcon />
            </IconButton>
          </Box>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <FormControlLabel
            control={<Checkbox checked={includeHardware} onChange={() => setIncludeHardware(!includeHardware)} />}
            label="Include Hardware Labor ($129.90/hr with tax)"
          />
          <FormControlLabel
            control={<Checkbox checked={includeSoftware} onChange={() => setIncludeSoftware(!includeSoftware)} />}
            label="Include Software Labor ($120/hr without tax)"
          />
        </Box>

        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddItem}
          sx={{ mb: 2 }}
        >
          Add Item
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Calculate
        </Button>
      </Box>
    </Container>
  );
}

ItemForm.propTypes = {
  onCalculateWeightedSum: PropTypes.func.isRequired,
};

export default ItemForm;
