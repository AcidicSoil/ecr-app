import React, { useState, useEffect, useMemo } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box, Container, Typography, IconButton, Chip, Autocomplete } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Fuse from 'fuse.js';

function ServiceSearch({ onAddService }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const [servicesData, setServicesData] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        // Fetch the services data from the JSON file
        fetch('/services.json')
            .then(response => {
                if (!response.ok) { throw new Error('Network response was not ok'); }
                return response.json();
            })
            .then(data => {
                setServicesData(data);
                setFilteredResults(data);  // Initialize with all services displayed
            })
            .catch(error => {
                console.error('Error loading the services data:', error);
            });
    }, []);

    const fuse = useMemo(() => new Fuse(servicesData, {
        keys: ['service', 'category'],
        threshold: 0.3,
    }), [servicesData]);

    const categories = useMemo(() => 
        ['All', ...new Set(servicesData.map(service => service.category))],
        [servicesData]
    );

    useEffect(() => {
        // Filter services based on the search term
        if (searchTerm === '' && selectedCategory === 'All') {
            setFilteredResults(servicesData);  // Show all services when search term is empty
        } else {
            let results = fuse.search(searchTerm).map(result => result.item);
            if (selectedCategory !== 'All') {
                results = results.filter(service => service.category === selectedCategory);
            }
            setFilteredResults(results);
        }
    }, [searchTerm, selectedCategory, servicesData, fuse]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <Container>
            <Box sx={{ mb: 2 }}>
                <TextField
                    label="Search Service"
                    value={searchTerm}
                    onChange={event => setSearchTerm(event.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Autocomplete
                    value={selectedCategory}
                    onChange={(event, newValue) => {
                        setSelectedCategory(newValue);
                    }}
                    options={categories}
                    renderInput={(params) => <TextField {...params} label="Category" />}
                    sx={{ mt: 2 }}
                    getOptionLabel={(option) => option} // Add this line
                />
            </Box>

            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={toggleExpand}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Available Services
                    </Typography>
                    <IconButton>
                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                </Box>

                {isExpanded && (
                    <Box>
                        {filteredResults.length > 0 ? (
                            filteredResults.map((result, index) => (
                                <Box key={index} sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="subtitle1">{result.service}</Typography>
                                        <Typography variant="body2"><strong>Cost:</strong> ${result.cost}</Typography>
                                        <Typography variant="body2"><strong>Time:</strong> {result.time}</Typography>
                                        <Chip label={result.category} size="small" sx={{ mt: 1 }} />
                                    </Box>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<AddCircleOutlineIcon />}
                                        onClick={() => onAddService(result)}
                                    >
                                        Add
                                    </Button>
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body2" color="textSecondary">No services found.</Typography>
                        )}
                    </Box>
                )}
            </Box>
        </Container>
    );
}

export default ServiceSearch;
