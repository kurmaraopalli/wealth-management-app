import { NavLink } from 'react-router-dom';

const items = [
  { path: '/', label: 'Home' },
  { path: '/equities', label: 'Equities' },
  { path: '/mutual-funds', label: 'Mutual Funds' },
  { path: '/debt-funds', label: 'Debt Funds' },
  { path: '/global-indexes', label: 'Global Indexes' },
  { path: '/foreign-portfolio', label: 'Foreign Portfolio' },
  { path: '/about', label: 'About' },
];

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="brand">Wealth Manager</div>
      <div className="links">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
