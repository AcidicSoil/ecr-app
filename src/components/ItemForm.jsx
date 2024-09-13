import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import TextField from '@mui/material/TextField';
import { Box, Container, IconButton } from '@mui/material';
import { useSpring, animated } from '@react-spring/web'; // Import from react-spring

function ItemForm({ onCalculateWeightedSum }) {
  const [items, setItems] = useState([{ number: '', quantity: 1 }]);
  const [includeHardware, setIncludeHardware] = useState(false);
  const [includeSoftware, setIncludeSoftware] = useState(false);
  const [hardwareHours, setHardwareHours] = useState(1);
  const [softwareHours, setSoftwareHours] = useState(1);

  // Button hover animations using react-spring
  const [hoveredAdd, setHoveredAdd] = useState(false);
  const [hoveredRemove, setHoveredRemove] = useState(false);
  const [hoveredCalculate, setHoveredCalculate] = useState(false);

  // Checkbox animations using react-spring
  const [hoveredHardwareCheckbox, setHoveredHardwareCheckbox] = useState(false);
  const [hoveredSoftwareCheckbox, setHoveredSoftwareCheckbox] = useState(false);

  const springPropsAdd = useSpring({
    transform: hoveredAdd ? 'scale(1.1)' : 'scale(1)',
    boxShadow: hoveredAdd ? '0px 5px 15px rgba(0,0,0,0.3)' : '0px 2px 8px rgba(0,0,0,0.2)',
  });

  const springPropsRemove = useSpring({
    transform: hoveredRemove ? 'scale(1.1)' : 'scale(1)',
    boxShadow: hoveredRemove ? '0px 5px 15px rgba(0,0,0,0.3)' : '0px 2px 8px rgba(0,0,0,0.2)',
  });

  const springPropsCalculate = useSpring({
    transform: hoveredCalculate ? 'scale(1.1)' : 'scale(1)',
    boxShadow: hoveredCalculate ? '0px 5px 15px rgba(0,0,0,0.3)' : '0px 2px 8px rgba(0,0,0,0.2)',
  });

  // Checkbox animations
  const springPropsHardwareCheckbox = useSpring({
    transform: hoveredHardwareCheckbox ? 'scale(1.2)' : 'scale(1)',
  });

  const springPropsSoftwareCheckbox = useSpring({
    transform: hoveredSoftwareCheckbox ? 'scale(1.2)' : 'scale(1)',
  });

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
    onCalculateWeightedSum(items, includeHardware, hardwareHours, includeSoftware, softwareHours);
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

            {/* Animated Remove IconButton */}
            <animated.div
              style={springPropsRemove}
              onMouseEnter={() => setHoveredRemove(true)}
              onMouseLeave={() => setHoveredRemove(false)}
            >
              <IconButton onClick={() => handleRemoveItem(index)} color="error">
                <RemoveCircleOutlineIcon />
              </IconButton>
            </animated.div>
          </Box>
        ))}

        {/* Animated Checkbox for Include Hardware */}
        <animated.div
          style={springPropsHardwareCheckbox}
          onMouseEnter={() => setHoveredHardwareCheckbox(true)}
          onMouseLeave={() => setHoveredHardwareCheckbox(false)}
        >
          <label>
            <input
              type="checkbox"
              checked={includeHardware}
              onChange={() => setIncludeHardware(!includeHardware)}
            />
            Include Hardware Labor
          </label>
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
        </animated.div>

        {/* Animated Checkbox for Include Software */}
        <animated.div
          style={springPropsSoftwareCheckbox}
          onMouseEnter={() => setHoveredSoftwareCheckbox(true)}
          onMouseLeave={() => setHoveredSoftwareCheckbox(false)}
        >
          <label>
            <input
              type="checkbox"
              checked={includeSoftware}
              onChange={() => setIncludeSoftware(!includeSoftware)}
            />
            Include Software Labor
          </label>
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
        </animated.div>

        {/* Animated Add Item Button */}
        <animated.button
          style={springPropsAdd}
          onMouseEnter={() => setHoveredAdd(true)}
          onMouseLeave={() => setHoveredAdd(false)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={handleAddItem}
          type="button"
        >
          <AddCircleOutlineIcon sx={{ mr: 1 }} />
          Add Item
        </animated.button>

        {/* Animated Calculate Button */}
        <animated.button
          style={springPropsCalculate}
          onMouseEnter={() => setHoveredCalculate(true)}
          onMouseLeave={() => setHoveredCalculate(false)}
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Calculate
        </animated.button>
      </Box>
    </Container>
  );
}

ItemForm.propTypes = {
  onCalculateWeightedSum: PropTypes.func.isRequired,
};

export default ItemForm;
