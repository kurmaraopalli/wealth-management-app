import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>About Khavish</Text>
      <Text style={styles.description}>Hi, I am Khavish. I am a developer studying in 6th grade.</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>About this app</Text>
        <Text style={styles.cardText}>
          This wealth management app helps you explore equities, mutual funds, debt funds, and foreign
          portfolios. It runs on both web and mobile with a simple and modern interface.
        </Text>
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
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardText: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 22,
  },
});
