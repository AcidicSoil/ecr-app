import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

function CostBreakdown({ items, includeHardware, hardwareHours, includeSoftware, softwareHours, totalWeightedSum }) {
  const calculateItemTotal = (item) => {
    const price = parseFloat(item.number);
    const quantity = parseInt(item.quantity, 10);
    let itemTotal = price <= 50 ? price * 2 : price * 1.3;
    return itemTotal * quantity;
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Copied to clipboard');
        // You could add a temporary visual feedback here
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Unit Price</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Copy</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => {
            const itemTotal = calculateItemTotal(item);
            return (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  Service Item
                </TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">${parseFloat(item.number).toFixed(2)}</TableCell>
                <TableCell align="right">${itemTotal.toFixed(2)}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Copy total">
                    <IconButton onClick={() => handleCopy(itemTotal.toFixed(2))} size="small">
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
          {includeHardware && (
            <TableRow>
              <TableCell component="th" scope="row">Hardware Support</TableCell>
              <TableCell align="right">{hardwareHours}</TableCell>
              <TableCell align="right">$129.90</TableCell>
              <TableCell align="right">${(hardwareHours * 129.90).toFixed(2)}</TableCell>
              <TableCell align="right">
                <Tooltip title="Copy total">
                  <IconButton onClick={() => handleCopy((hardwareHours * 129.90).toFixed(2))} size="small">
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          )}
          {includeSoftware && (
            <TableRow>
              <TableCell component="th" scope="row">Software Support</TableCell>
              <TableCell align="right">{softwareHours}</TableCell>
              <TableCell align="right">$120.00</TableCell>
              <TableCell align="right">${(softwareHours * 120).toFixed(2)}</TableCell>
              <TableCell align="right">
                <Tooltip title="Copy total">
                  <IconButton onClick={() => handleCopy((softwareHours * 120).toFixed(2))} size="small">
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell align="right">${totalWeightedSum.toFixed(2)}</TableCell>
            <TableCell align="right">
              <Tooltip title="Copy total">
                <IconButton onClick={() => handleCopy(totalWeightedSum.toFixed(2))} size="small">
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CostBreakdown;