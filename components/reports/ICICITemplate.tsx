'use client';

import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register a clean font (optional, using default Helvetica/Times for reliability)
// Font.register({ family: 'Inter', src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2' });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
    color: '#333',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2pt solid #2563eb',
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1e3a8a',
    borderBottom: '1pt solid #e5e7eb',
    paddingBottom: 4,
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    width: 140,
    fontWeight: 'bold',
    color: '#666',
  },
  value: {
    flex: 1,
    color: '#000',
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 20,
  },
  tableHeader: {
    backgroundColor: '#f9fafb',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  tableCell: {
    padding: 6,
    flex: 1,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoContainer: {
    width: '48%',
    marginBottom: 10,
  },
  photo: {
    width: '100%',
    height: 150,
    objectFit: 'cover',
    borderRadius: 4,
    border: '1pt solid #e5e7eb',
  },
  photoLabel: {
    fontSize: 8,
    marginTop: 4,
    textAlign: 'center',
    color: '#666',
    textTransform: 'uppercase',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: '1pt solid #e5e7eb',
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 8,
    color: '#999',
  }
});

interface PDFData {
  caseId: string;
  applicant: string;
  bank: string;
  address: string;
  propertyType: string;
  visitDate: string;
  engineer: string;
  measurements: {
    plotArea: string;
    builtupArea: string;
    rate: string;
  };
  remarks: string;
  photos: { url: string; category: string }[];
}

export default function ICICITemplate({ data }: { data: PDFData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Valuation Report</Text>
            <Text style={{ fontSize: 8, color: '#666' }}>ASTRON CONSULTING SERVICES</Text>
          </View>
          <View style={{ textAlign: 'right' }}>
            <Text style={{ fontWeight: 'bold' }}>{data.bank}</Text>
            <Text style={{ fontSize: 8 }}>Case ID: {data.caseId}</Text>
          </View>
        </View>

        {/* Case Info Section */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>1. General Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Applicant Name:</Text>
            <Text style={styles.value}>{data.applicant}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Property Address:</Text>
            <Text style={styles.value}>{data.address}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Property Type:</Text>
            <Text style={styles.value}>{data.propertyType}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Visit Date:</Text>
            <Text style={styles.value}>{data.visitDate}</Text>
          </View>
        </View>

        {/* Measurements Section */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>2. Area & Measurements</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCell}>Description</Text>
              <Text style={styles.tableCell}>Area / Dimensions</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Plot Area</Text>
              <Text style={styles.tableCell}>{data.measurements.plotArea} Sq. Ft.</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Built-up Area</Text>
              <Text style={styles.tableCell}>{data.measurements.builtupArea} Sq. Ft.</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Current Market Rate</Text>
              <Text style={styles.tableCell}>₹ {data.measurements.rate} / Sq. Ft.</Text>
            </View>
          </View>
        </View>

        {/* Remarks Section */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>3. Technical Remarks</Text>
          <Text style={{ fontSize: 9, color: '#444', lineHeight: 1.6 }}>{data.remarks}</Text>
        </View>

        {/* Engineer Signature Block */}
        <View style={{ marginTop: 40, flexDirection: 'row', justifyContent: 'flex-end' }}>
          <View style={{ width: 150, textAlign: 'center' }}>
            <View style={{ borderBottom: '1pt solid #000', marginBottom: 5 }} />
            <Text style={{ fontWeight: 'bold' }}>{data.engineer}</Text>
            <Text style={{ fontSize: 8, color: '#666' }}>Valuation Engineer</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          This is a computer-generated valuation report. For ASTRON CONSULTING SERVICES.
        </Text>
      </Page>

      {/* Photo Page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.subtitle}>4. Property Photographs</Text>
        <View style={styles.photoGrid}>
          {data.photos.map((photo, index) => (
            <View key={index} style={styles.photoContainer}>
              <Image src={photo.url} style={styles.photo} />
              <Text style={styles.photoLabel}>{photo.category} View</Text>
            </View>
          ))}
        </View>
        <Text style={styles.footer}>Page 2 of 2 - Property Photos</Text>
      </Page>
    </Document>
  );
}
