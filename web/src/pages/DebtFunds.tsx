export default function DebtFunds() {
  const funds = [
    { name: 'Secure Income Fund', type: 'Short Duration', yield: '6.4%' },
    { name: 'AAA Corporate Bond Fund', type: 'Corporate Bond', yield: '7.1%' },
    { name: 'Government Securities Fund', type: 'Gilt', yield: '6.0%' },
    { name: 'Dynamic Bond Fund', type: 'Dynamic Bond', yield: '6.7%' },
    { name: 'Medium Duration Fund', type: 'Medium Duration', yield: '6.5%' },
    { name: 'Liquid Fund', type: 'Ultra Short Duration', yield: '5.1%' },
    { name: 'Credit Risk Fund', type: 'Credit Risk', yield: '7.8%' },
    { name: 'Income Advantage Fund', type: 'Income', yield: '6.9%' },
    { name: 'Banking & PSU Debt Fund', type: 'Banking & PSU', yield: '6.6%' },
    { name: 'Dynamic Gilt Fund', type: 'Dynamic Gilt', yield: '6.2%' },
  ];

  return (
    <section>
      <h1>Debt Funds</h1>
      <p>Track fixed income and debt fund portfolios with risk and return measures.</p>
      <ul className="fund-list">
        {funds.map((fund) => (
          <li key={fund.name}>
            <strong>{fund.name}</strong>
            <span>{fund.type}, {fund.yield} yield</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
