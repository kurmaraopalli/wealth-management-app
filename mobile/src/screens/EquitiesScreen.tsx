import { ScrollView, StyleSheet, Text, View } from 'react-native';

const equityGroups = [
  {
    country: 'India',
    items: [
      { symbol: 'TCS', name: 'TCS Ltd.', price: '₹3,420', gain: '+6.1%' },
      { symbol: 'RELIANCE', name: 'Reliance Industries', price: '₹2,650', gain: '+5.4%' },
      { symbol: 'INFY', name: 'Infosys Ltd.', price: '₹1,920', gain: '+4.8%' },
      { symbol: 'HDFCBANK', name: 'HDFC Bank', price: '₹1,730', gain: '+5.9%' },
      { symbol: 'ICICIBANK', name: 'ICICI Bank', price: '₹905', gain: '+4.6%' },
      { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: '₹2,680', gain: '+3.7%' },
      { symbol: 'BAJFINANCE', name: 'Bajaj Finance', price: '₹7,200', gain: '+7.4%' },
      { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', price: '₹2,120', gain: '+4.2%' },
      { symbol: 'MARUTI', name: 'Maruti Suzuki India', price: '₹10,150', gain: '+6.0%' },
      { symbol: 'ASIANPAINT', name: 'Asian Paints', price: '₹3,450', gain: '+5.8%' },
    ],
  },
  {
    country: 'US',
    items: [
      { symbol: 'AAPL', name: 'Apple Inc.', price: '$175.17', gain: '+8.4%' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: '$330.45', gain: '+5.6%' },
      { symbol: 'AMZN', name: 'Amazon.com', price: '$145.60', gain: '+9.2%' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '$133.90', gain: '+6.7%' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: '$255.22', gain: '+4.1%' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: '$804.34', gain: '+11.5%' },
      { symbol: 'JPM', name: 'JPMorgan Chase', price: '$176.14', gain: '+3.9%' },
      { symbol: 'JNJ', name: 'Johnson & Johnson', price: '$168.25', gain: '+4.2%' },
      { symbol: 'V', name: 'Visa Inc.', price: '$264.90', gain: '+5.1%' },
      { symbol: 'META', name: 'Meta Platforms', price: '$444.08', gain: '+7.2%' },
    ],
  },
  {
    country: 'China',
    items: [
      { symbol: 'BABA', name: 'Alibaba Group', price: '$79.45', gain: '+6.0%' },
      { symbol: 'TCEHY', name: 'Tencent Holdings', price: '$43.22', gain: '+5.3%' },
      { symbol: 'BIDU', name: 'Baidu Inc.', price: '$147.10', gain: '+4.8%' },
      { symbol: 'PDD', name: 'PDD Holdings', price: '$54.90', gain: '+6.9%' },
      { symbol: 'NIO', name: 'NIO Inc.', price: '$12.40', gain: '+9.8%' },
      { symbol: 'BYD', name: 'BYD Co. Ltd.', price: '$34.55', gain: '+7.1%' },
      { symbol: 'JD', name: 'JD.com Inc.', price: '$61.60', gain: '+5.7%' },
      { symbol: 'NTES', name: 'NetEase Inc.', price: '$78.25', gain: '+4.5%' },
      { symbol: 'LI', name: 'Li Auto Inc.', price: '$28.30', gain: '+8.2%' },
      { symbol: 'IQ', name: 'iQIYI, Inc.', price: '$8.55', gain: '+3.6%' },
    ],
  },
];

export default function EquitiesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Equities</Text>
      <Text style={styles.description}>Manage your stock portfolio and review current positions.</Text>
      {equityGroups.map((group) => (
        <View key={group.country} style={styles.group}>
          <Text style={styles.groupTitle}>{group.country} Companies</Text>
          {group.items.map((company) => (
            <View key={company.symbol} style={styles.row}>
              <View>
                <Text style={styles.symbol}>{company.symbol}</Text>
                <Text style={styles.companyName}>{company.name}</Text>
              </View>
              <View style={styles.companyMeta}>
                <Text style={styles.value}>{company.price}</Text>
                <Text style={styles.gain}>{company.gain}</Text>
              </View>
            </View>
          ))}
        </View>
      ))}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Global equity exposure</Text>
        <Text style={styles.summaryText}>30 core companies across India, the US, and China for diversified coverage.</Text>
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
  group: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  row: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  symbol: {
    fontSize: 16,
    fontWeight: '600',
  },
  companyName: {
    color: '#6b7280',
    marginTop: 4,
    maxWidth: 220,
  },
  companyMeta: {
    alignItems: 'flex-end',
  },
  value: {
    color: '#111827',
    fontWeight: '700',
  },
  gain: {
    color: '#047857',
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginTop: 22,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  summaryText: {
    color: '#475569',
    fontSize: 14,
  },
});
