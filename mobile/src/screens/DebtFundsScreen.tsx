import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DebtFundsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Debt Funds</Text>
      <Text style={styles.description}>View stable income portfolios and interest-sensitive holdings.</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Short Duration Debt</Text>
        <Text style={styles.cardText}>6.4% projected yield</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Corporate Bond Fund</Text>
        <Text style={styles.cardText}>6.8% projected yield</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#eef4ff',
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
