import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function MutualFundsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mutual Funds</Text>
      <Text style={styles.description}>Track fund categories, returns, and allocations in one place.</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Large Cap Fund</Text>
        <Text style={styles.cardText}>12.1% YTD return</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Balanced Advantage</Text>
        <Text style={styles.cardText}>8.9% YTD return</Text>
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
});
