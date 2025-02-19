import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register custom fonts
Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf', fontWeight: 700 },
  ]
});

const styles = StyleSheet.create({
  page: { 
    padding: 40,
    fontFamily: 'Open Sans',
    fontSize: 11,
    color: '#333333'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    borderBottom: '2px solid #2196f3',
    paddingBottom: 20,
  },
  logoContainer: {
    width: '40%',
  },
  logo: { 
    width: 120,
    height: 60,
    marginBottom: 10,
  },
  contactInfo: {
    width: '40%',
    textAlign: 'right',
    fontSize: 10,
    color: '#666666',
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    color: '#2196f3',
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 20,
    color: '#666666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 10,
    color: '#2196f3',
  },
  table: {
    display: 'table',
    width: '100%',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #e0e0e0',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 600,
    padding: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #e0e0e0',
    padding: '8px 0',
    fontSize: 10,
  },
  tableCol: {
    width: '25%',
    textAlign: 'center',
    padding: '4px 8px',
  },
  tableColLeft: {
    width: '25%',
    textAlign: 'left',
    padding: '4px 8px',
  },
  tableColRight: {
    width: '25%',
    textAlign: 'right',
    padding: '4px 8px',
  },
  laborSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
  },
  laborRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    fontSize: 10,
  },
  totalSection: {
    marginTop: 30,
    borderTop: '2px solid #2196f3',
    paddingTop: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 600,
    marginRight: 20,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 700,
    color: '#2196f3',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#666666',
    borderTop: '1px solid #e0e0e0',
    paddingTop: 20,
  },
});

const QuoteGenerator = ({ items, includeHardware, hardwareHours, includeSoftware, softwareHours, totalWeightedSum, quoteNumber }) => {
  const logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...'; // Your base64 encoded image
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Image style={styles.logo} src={logo} />
          </View>
          <View style={styles.contactInfo}>
            <Text>Error Computer Repair</Text>
            <Text>651 N Egret Bay Blvd</Text>
            <Text>League City, TX 77573</Text>
            <Text>Phone: 832.377.6727</Text>
            <Text>Email: error@error-cr.com</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>IT Service Quote</Text>
          <Text style={styles.subtitle}>Quote #: {quoteNumber} | Date: {today}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Items</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableColLeft}>Description</Text>
              <Text style={styles.tableCol}>Unit Price</Text>
              <Text style={styles.tableCol}>Quantity</Text>
              <Text style={styles.tableColRight}>Total</Text>
            </View>
            {items.map((item, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableColLeft}>Service Item {index + 1}</Text>
                <Text style={styles.tableCol}>${parseFloat(item.number).toFixed(2)}</Text>
                <Text style={styles.tableCol}>{item.quantity}</Text>
                <Text style={styles.tableColRight}>${calculateItemTotal(item).toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>

        {(includeHardware || includeSoftware) && (
          <View style={styles.laborSection}>
            <Text style={styles.sectionTitle}>Labor Charges</Text>
            {includeHardware && (
              <View style={styles.laborRow}>
                <Text>Hardware Labor ({hardwareHours} hours @ $129.90/hour)</Text>
                <Text>${(hardwareHours * 129.90).toFixed(2)}</Text>
              </View>
            )}
            {includeSoftware && (
              <View style={styles.laborRow}>
                <Text>Software Labor ({softwareHours} hours @ $120.00/hour)</Text>
                <Text>${(softwareHours * 120).toFixed(2)}</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalAmount}>${totalWeightedSum.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Thank you for choosing Error Computer Repair</Text>
          <Text>This quote is valid for 30 days from the date of issue.</Text>
          <Text>Terms & Conditions: Payment is due upon completion of services.</Text>
        </View>
      </Page>
    </Document>
  );
}

function calculateItemTotal(item) {
  const price = parseFloat(item.number);
  const quantity = parseInt(item.quantity, 10);
  let itemTotal = price <= 50 ? price * 2 : price * 1.3;
  return itemTotal * quantity;
}

export default QuoteGenerator;