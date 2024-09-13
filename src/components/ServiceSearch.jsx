import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box, Container, Typography, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

function ServiceSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const [servicesData, setServicesData] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false); // State to manage expand/minimize

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

    useEffect(() => {
        // Filter services based on the search term
        if (searchTerm === '') {
            setFilteredResults(servicesData);  // Show all services when search term is empty
        } else {
            const regex = new RegExp(searchTerm.split('').join('.*'), 'i');
            const filteredResults = servicesData.filter(service =>
                regex.test(service.service)
            );
            setFilteredResults(filteredResults);
        }
    }, [searchTerm, servicesData]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Description copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    return (
        <Container>
            <Box>
                <TextField
                    label="Search Service"
                    value={searchTerm}
                    onChange={event => setSearchTerm(event.target.value)}
                    fullWidth
                    margin="normal"
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
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1">{result.service}</Typography>
                                    <Typography variant="body2">{result.description}</Typography>
                                    <Typography variant="body2"><strong>Cost:</strong> ${result.cost}</Typography>
                                    <Typography variant="body2"><strong>Time:</strong> {result.time}</Typography>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<ContentCopyIcon />}
                                        onClick={() => copyToClipboard(result.description)}
                                        sx={{ mt: 1 }}
                                    >
                                        Copy Description
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
