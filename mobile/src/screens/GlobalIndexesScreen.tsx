import { ScrollView, StyleSheet, Text, View } from 'react-native';

const indexes = [
  { name: 'S&P 500', region: 'United States' },
  { name: 'NASDAQ Composite', region: 'United States' },
  { name: 'Dow Jones Industrial Average', region: 'United States' },
  { name: 'FTSE 100', region: 'United Kingdom' },
  { name: 'DAX', region: 'Germany' },
  { name: 'CAC 40', region: 'France' },
  { name: 'Nikkei 225', region: 'Japan' },
  { name: 'Hang Seng', region: 'Hong Kong' },
  { name: 'Shanghai Composite', region: 'China' },
  { name: 'BSE Sensex', region: 'India' },
  { name: 'Nifty 50', region: 'India' },
  { name: 'ASX 200', region: 'Australia' },
  { name: 'TSX Composite', region: 'Canada' },
  { name: 'Euro Stoxx 50', region: 'Eurozone' },
  { name: 'MSCI World', region: 'Global' },
];

export default function GlobalIndexesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Global Indexes</Text>
      <Text style={styles.description}>Discover the major global stock indexes driving markets around the world.</Text>
      {indexes.map((index) => (
        <View style={styles.card} key={index.name}>
          <Text style={styles.cardTitle}>{index.name}</Text>
          <Text style={styles.cardText}>{index.region}</Text>
        </View>
      ))}
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
});
