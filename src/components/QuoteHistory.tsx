import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Collapse,
  Stack,
  Chip,
} from '@mui/material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import DeleteIcon from '@mui/icons-material/Delete';
import SortIcon from '@mui/icons-material/Sort';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from '@mui/icons-material/Search';
import QuoteGenerator from './QuoteGenerator';

interface Quote {
  id: string;
  date: string;
  totalAmount: number;
  items: Array<{
    number: string;
    quantity: number;
  }>;
  includeHardware: boolean;
  hardwareHours: number;
  includeSoftware: boolean;
  softwareHours: number;
}

interface QuoteHistoryProps {
  quotes: Quote[];
  onDeleteQuote?: (id: string) => void;
}

type SortField = 'date' | 'totalAmount' | 'id';
type SortOrder = 'asc' | 'desc';

const QuoteHistory: React.FC<QuoteHistoryProps> = ({ quotes, onDeleteQuote }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [expandedQuote, setExpandedQuote] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedQuotes = useMemo(() => {
    return quotes
      .filter(quote => 
        quote.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.date.includes(searchTerm) ||
        quote.totalAmount.toString().includes(searchTerm)
      )
      .sort((a, b) => {
        const multiplier = sortOrder === 'asc' ? 1 : -1;
        if (sortField === 'date') {
          return multiplier * (new Date(a.date).getTime() - new Date(b.date).getTime());
        }
        if (sortField === 'totalAmount') {
          return multiplier * (a.totalAmount - b.totalAmount);
        }
        return multiplier * a.id.localeCompare(b.id);
      });
  }, [quotes, searchTerm, sortField, sortOrder]);

  const toggleExpand = (quoteId: string) => {
    setExpandedQuote(expandedQuote === quoteId ? null : quoteId);
  };

  if (quotes.length === 0) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Quote History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No quotes saved yet. Create a quote to see it here.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Quote History
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search quotes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ flexGrow: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortField}
            label="Sort by"
            onChange={(e) => handleSort(e.target.value as SortField)}
          >
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="totalAmount">Amount</MenuItem>
            <MenuItem value="id">Quote ID</MenuItem>
          </Select>
        </FormControl>
        <IconButton onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
          <SortIcon sx={{ transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'none' }} />
        </IconButton>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Quote ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Total Amount</TableCell>
              <TableCell align="center">Services</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedQuotes.map((quote) => (
              <React.Fragment key={quote.id}>
                <TableRow 
                  hover
                  onClick={() => toggleExpand(quote.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell component="th" scope="row">
                    {quote.id}
                  </TableCell>
                  <TableCell>{quote.date}</TableCell>
                  <TableCell align="right">${quote.totalAmount.toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Chip 
                        size="small" 
                        label={`${quote.items.length} items`}
                      />
                      {quote.includeHardware && (
                        <Chip 
                          size="small" 
                          label={`HW: ${quote.hardwareHours}h`} 
                          color="primary"
                        />
                      )}
                      {quote.includeSoftware && (
                        <Chip 
                          size="small" 
                          label={`SW: ${quote.softwareHours}h`}
                          color="secondary"
                        />
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <PDFDownloadLink
                        document={
                          <QuoteGenerator
                            items={quote.items}
                            includeHardware={quote.includeHardware}
                            hardwareHours={quote.hardwareHours}
                            includeSoftware={quote.includeSoftware}
                            softwareHours={quote.softwareHours}
                            totalWeightedSum={quote.totalAmount}
                            quoteNumber={quote.id}
                          />
                        }
                        fileName={`quote_${quote.id}.pdf`}
                      >
                        {({ loading }) => (
                          <Button
                            variant="contained"
                            size="small"
                            disabled={loading}
                          >
                            {loading ? 'Loading...' : 'Download PDF'}
                          </Button>
                        )}
                      </PDFDownloadLink>
                      {onDeleteQuote && (
                        <Tooltip title="Delete quote">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteQuote(quote.id);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <IconButton size="small">
                        {expandedQuote === quote.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={5} sx={{ py: 0 }}>
                    <Collapse in={expandedQuote === quote.id}>
                      <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Quote Details
                        </Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Item</TableCell>
                              <TableCell align="right">Price</TableCell>
                              <TableCell align="right">Quantity</TableCell>
                              <TableCell align="right">Total</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {quote.items.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>Item {index + 1}</TableCell>
                                <TableCell align="right">${item.number}</TableCell>
                                <TableCell align="right">{item.quantity}</TableCell>
                                <TableCell align="right">
                                  ${(parseFloat(item.number) * item.quantity).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            ))}
                            {quote.includeHardware && (
                              <TableRow>
                                <TableCell>Hardware Labor</TableCell>
                                <TableCell align="right">$129.90/h</TableCell>
                                <TableCell align="right">{quote.hardwareHours}h</TableCell>
                                <TableCell align="right">
                                  ${(129.90 * quote.hardwareHours).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            )}
                            {quote.includeSoftware && (
                              <TableRow>
                                <TableCell>Software Labor</TableCell>
                                <TableCell align="right">$120.00/h</TableCell>
                                <TableCell align="right">{quote.softwareHours}h</TableCell>
                                <TableCell align="right">
                                  ${(120 * quote.softwareHours).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default QuoteHistory; 