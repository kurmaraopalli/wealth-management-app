import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Wealth Management</Text>
      <Text style={styles.subtitle}>Track your portfolio across all categories.</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Equities</Text>
        <Text style={styles.cardText}>Review stock holdings and performance summaries.</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Mutual Funds</Text>
        <Text style={styles.cardText}>Monitor your fund allocations and returns.</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Debt Funds</Text>
        <Text style={styles.cardText}>See fixed income exposure and yield.</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Foreign Portfolio</Text>
        <Text style={styles.cardText}>Manage international investments easily.</Text>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#475569',
  },
});
