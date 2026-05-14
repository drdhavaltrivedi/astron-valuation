'use client';

import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 50, fontSize: 10, fontFamily: 'Helvetica' },
  header: { marginBottom: 30, textAlign: 'center' },
  bankLogo: { fontSize: 24, fontWeight: 'bold', color: '#1a237e' },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', backgroundColor: '#e8eaf6', padding: 4, marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', borderTop: '0.5pt solid #ccc' },
  cell: { width: '50%', padding: 6, borderBottom: '0.5pt solid #ccc', borderLeft: '0.5pt solid #ccc' },
  cellLabel: { fontSize: 8, color: '#666', marginBottom: 2 },
  cellValue: { fontWeight: 'bold' },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 20 },
  photoBox: { width: '31%', marginBottom: 10 },
  photo: { width: '100%', height: 100, objectFit: 'cover', borderRadius: 2 },
  footer: { position: 'absolute', bottom: 30, left: 50, right: 50, textAlign: 'center', fontSize: 8, color: '#999' }
});

export default function HDFCTemplate({ data }: any) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.bankLogo}>HDFC BANK LTD</Text>
          <Text style={{ fontSize: 9 }}>PROPERTY VALUATION REPORT</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PART A: CUSTOMER & PROPERTY DETAILS</Text>
          <View style={styles.grid}>
            <View style={styles.cell}><Text style={styles.cellLabel}>APPLICANT NAME</Text><Text style={styles.cellValue}>{data.applicant}</Text></View>
            <View style={styles.cell}><Text style={styles.cellLabel}>APPLICATION ID</Text><Text style={styles.cellValue}>{data.caseId}</Text></View>
            <View style={styles.cell}><Text style={styles.cellLabel}>PROPERTY ADDRESS</Text><Text style={styles.cellValue}>{data.address}</Text></View>
            <View style={styles.cell}><Text style={styles.cellLabel}>CITY / PINCODE</Text><Text style={styles.cellValue}>Ahmedabad - 380015</Text></View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PART B: TECHNICAL SPECIFICATIONS</Text>
          <View style={styles.grid}>
            <View style={styles.cell}><Text style={styles.cellLabel}>TOTAL PLOT AREA</Text><Text style={styles.cellValue}>{data.measurements.plotArea} SQFT</Text></View>
            <View style={styles.cell}><Text style={styles.cellLabel}>BUILT-UP AREA</Text><Text style={styles.cellValue}>{data.measurements.builtupArea} SQFT</Text></View>
            <View style={styles.cell}><Text style={styles.cellLabel}>TYPE OF STRUCTURE</Text><Text style={styles.cellValue}>RCC FRAMED</Text></View>
            <View style={styles.cell}><Text style={styles.cellLabel}>AGE OF PROPERTY</Text><Text style={styles.cellValue}>5 YEARS</Text></View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PART C: VALUATION SUMMARY</Text>
          <View style={styles.grid}>
            <View style={styles.cell}><Text style={styles.cellLabel}>MARKET RATE</Text><Text style={styles.cellValue}>Rs. {data.measurements.rate} / SQFT</Text></View>
            <View style={styles.cell}><Text style={styles.cellLabel}>TOTAL MARKET VALUE</Text><Text style={styles.cellValue}>Rs. 99,00,000/-</Text></View>
          </View>
        </View>

        <View style={{ marginTop: 50 }}>
          <Text style={{ fontSize: 9 }}>AUTHORIZED SIGNATORY</Text>
          <Text style={{ fontSize: 8, color: '#666' }}>For ASTRON CONSULTING SERVICES</Text>
        </View>

        <Text style={styles.footer}>HDFC Technical Empanelment Report - Confidential</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>ANNEXURE: SITE PHOTOGRAPHS</Text>
        <View style={styles.photoGrid}>
          {data.photos.map((p: any, i: number) => (
            <View key={i} style={styles.photoBox}>
              <Image src={p.url} style={styles.photo} />
              <Text style={{ fontSize: 7, textAlign: 'center', marginTop: 2 }}>{p.category}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
