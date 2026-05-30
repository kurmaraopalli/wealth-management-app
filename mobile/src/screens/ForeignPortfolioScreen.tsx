import { ScrollView, StyleSheet, Text, View } from 'react-native';

const equityCompanies = [
  'Apple Inc. (AAPL)',
  'Microsoft Corp. (MSFT)',
  'Amazon.com Inc. (AMZN)',
  'Alphabet Inc. (GOOGL)',
  'Tesla Inc. (TSLA)',
  'Nestlé S.A. (NESN)',
  'ASML Holding (ASML)',
  'Samsung Electronics (005930.KS)',
  'Toyota Motor (7203.T)',
  'Roche Holding (ROG.SW)',
];

const debtIssuers = [
  'US Treasury',
  'German Bund',
  'Japan Government Bond',
  'UK Gilt',
  'France OAT',
  'Australia Government Bond',
  'Canada Government Bond',
  'Singapore Government Bond',
  'World Bank Bond',
  'Toyota Motor Credit Bond',
];

export default function ForeignPortfolioScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Foreign Portfolio</Text>
      <Text style={styles.description}>Monitor international assets and currency diversification.</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Global Equity</Text>
        <Text style={styles.cardText}>US, Europe, and Asia stock exposure.</Text>
        {equityCompanies.map((company) => (
          <Text style={styles.listItem} key={company}>• {company}</Text>
        ))}
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>International Debt</Text>
        <Text style={styles.cardText}>Foreign bond issuers and stable debt exposure.</Text>
        {debtIssuers.map((issuer) => (
          <Text style={styles.listItem} key={issuer}>• {issuer}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#eff4ff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
  },
  description: {
    color: '#475569',
    marginBottom: 18,
    fontSize: 15,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardText: {
    color: '#475569',
    fontSize: 14,
  },
  listItem: {
    fontSize: 14,
    color: '#334155',
    marginTop: 10,
  },
});
