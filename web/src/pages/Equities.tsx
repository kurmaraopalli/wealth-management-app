const companies = [
  { symbol: 'TCS', name: 'TCS Ltd.', country: 'India', quantity: 140, price: '₹3,420', gain: '+6.1%' },
  { symbol: 'RELIANCE', name: 'Reliance Industries', country: 'India', quantity: 80, price: '₹2,650', gain: '+5.4%' },
  { symbol: 'INFY', name: 'Infosys Ltd.', country: 'India', quantity: 110, price: '₹1,920', gain: '+4.8%' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', country: 'India', quantity: 90, price: '₹1,730', gain: '+5.9%' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', country: 'India', quantity: 120, price: '₹905', gain: '+4.6%' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', country: 'India', quantity: 70, price: '₹2,680', gain: '+3.7%' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', country: 'India', quantity: 45, price: '₹7,200', gain: '+7.4%' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', country: 'India', quantity: 65, price: '₹2,120', gain: '+4.2%' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India', country: 'India', quantity: 55, price: '₹10,150', gain: '+6.0%' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints', country: 'India', quantity: 75, price: '₹3,450', gain: '+5.8%' },
  { symbol: 'AAPL', name: 'Apple Inc.', country: 'US', quantity: 50, price: '$175.17', gain: '+8.4%' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', country: 'US', quantity: 35, price: '$330.45', gain: '+5.6%' },
  { symbol: 'AMZN', name: 'Amazon.com', country: 'US', quantity: 18, price: '$145.60', gain: '+9.2%' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', country: 'US', quantity: 22, price: '$133.90', gain: '+6.7%' },
  { symbol: 'TSLA', name: 'Tesla Inc.', country: 'US', quantity: 28, price: '$255.22', gain: '+4.1%' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', country: 'US', quantity: 14, price: '$804.34', gain: '+11.5%' },
  { symbol: 'JPM', name: 'JPMorgan Chase', country: 'US', quantity: 40, price: '$176.14', gain: '+3.9%' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', country: 'US', quantity: 30, price: '$168.25', gain: '+4.2%' },
  { symbol: 'V', name: 'Visa Inc.', country: 'US', quantity: 25, price: '$264.90', gain: '+5.1%' },
  { symbol: 'META', name: 'Meta Platforms', country: 'US', quantity: 20, price: '$444.08', gain: '+7.2%' },
  { symbol: 'BABA', name: 'Alibaba Group', country: 'China', quantity: 60, price: '$79.45', gain: '+6.0%' },
  { symbol: 'TCEHY', name: 'Tencent Holdings', country: 'China', quantity: 50, price: '$43.22', gain: '+5.3%' },
  { symbol: 'BIDU', name: 'Baidu Inc.', country: 'China', quantity: 35, price: '$147.10', gain: '+4.8%' },
  { symbol: 'PDD', name: 'PDD Holdings', country: 'China', quantity: 28, price: '$54.90', gain: '+6.9%' },
  { symbol: 'NIO', name: 'NIO Inc.', country: 'China', quantity: 55, price: '$12.40', gain: '+9.8%' },
  { symbol: 'BYD', name: 'BYD Co. Ltd.', country: 'China', quantity: 22, price: '$34.55', gain: '+7.1%' },
  { symbol: 'JD', name: 'JD.com Inc.', country: 'China', quantity: 30, price: '$61.60', gain: '+5.7%' },
  { symbol: 'NTES', name: 'NetEase Inc.', country: 'China', quantity: 18, price: '$78.25', gain: '+4.5%' },
  { symbol: 'LI', name: 'Li Auto Inc.', country: 'China', quantity: 40, price: '$28.30', gain: '+8.2%' },
  { symbol: 'IQ', name: 'iQIYI, Inc.', country: 'China', quantity: 65, price: '$8.55', gain: '+3.6%' },
];

export default function Equities() {
  return (
    <section>
      <h1>Equities</h1>
      <p>Manage your equity holdings, watch top stocks, and review recent performance.</p>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Country</th>
            <th>Quantity</th>
            <th>Current Price</th>
            <th>Gain / Loss</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.symbol}>
              <td>{company.symbol}</td>
              <td>{company.name}</td>
              <td>{company.country}</td>
              <td>{company.quantity}</td>
              <td>{company.price}</td>
              <td>{company.gain}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
