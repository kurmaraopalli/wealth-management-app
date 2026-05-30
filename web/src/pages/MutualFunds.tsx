export default function MutualFunds() {
  const funds = [
    { name: 'ABC Large Cap Fund', category: 'Large Cap', ytd: '12.2%' },
    { name: 'PQR Mid Cap Fund', category: 'Mid Cap', ytd: '15.1%' },
    { name: 'XYZ Flexi Cap Fund', category: 'Flexi Cap', ytd: '14.3%' },
    { name: 'Global Equity Fund', category: 'International', ytd: '11.8%' },
    { name: 'Debt Hybrid Fund', category: 'Hybrid', ytd: '9.6%' },
    { name: 'Small Cap Advantage', category: 'Small Cap', ytd: '18.4%' },
    { name: 'ELSS Tax Saver', category: 'ELSS', ytd: '10.9%' },
    { name: 'Value Fund Strategy', category: 'Value', ytd: '13.7%' },
    { name: 'Dividend Yield Fund', category: 'Dividend', ytd: '8.5%' },
    { name: 'Balanced Advantage Fund', category: 'Balanced', ytd: '10.1%' },
  ];

  return (
    <section>
      <h1>Mutual Funds</h1>
      <p>Review your mutual fund schemes and asset allocation across categories.</p>
      <ul className="fund-list">
        {funds.map((fund) => (
          <li key={fund.name}>
            <strong>{fund.name}</strong>
            <span>{fund.category}, {fund.ytd} YTD</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
