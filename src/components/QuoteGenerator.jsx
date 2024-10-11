import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  section: { marginBottom: 10 },
  table: { display: 'table', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { margin: 'auto', flexDirection: 'row' },
  tableCol: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
  tableCell: { margin: 'auto', marginTop: 5, fontSize: 10 },
  totalRow: { fontWeight: 'bold' },
  logo: { width: 100, height: 50 }, // Adjusted size
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  contactInfo: { fontSize: 10, textAlign: 'right' },
  quoteNumber: { fontSize: 12, marginBottom: 10 },
});

const QuoteGenerator = ({ items, includeHardware, hardwareHours, includeSoftware, softwareHours, totalWeightedSum, quoteNumber }) => {
  const logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...'; // Your base64 encoded image
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Image 
              style={styles.logo} 
              src={logo}
            />
            <Text>Logo should be above this text</Text>
          </View>
          <View style={styles.contactInfo}>
            <Text>Error Computer Repair</Text>
            <Text>651 N Egret Bay Blvd</Text>
            <Text>league city, tx 77573</Text>
            <Text>Phone: 832.377.6727</Text>
            <Text>Email: error@error-cr.com</Text>
          </View>
        </View>

        <Text style={styles.title}>IT Service Quote</Text>
        <Text style={styles.quoteNumber}>Quote Number: {quoteNumber}</Text>
        
        <View style={styles.section}>
          <Text>Items:</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>Item</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>Price</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>Quantity</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>Total</Text></View>
            </View>
            {items.map((item, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableCol}><Text style={styles.tableCell}>Item {index + 1}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>${parseFloat(item.number).toFixed(2)}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{item.quantity}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>${calculateItemTotal(item).toFixed(2)}</Text></View>
              </View>
            ))}
          </View>
        </View>

        {includeHardware && (
          <View style={styles.section}>
            <Text>Hardware Labor: {hardwareHours} hours at $129.90/hour</Text>
          </View>
        )}

        {includeSoftware && (
          <View style={styles.section}>
            <Text>Software Labor: {softwareHours} hours at $120.00/hour</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.totalRow}>Total: ${totalWeightedSum.toFixed(2)}</Text>
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