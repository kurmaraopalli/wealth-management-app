import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function NavBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="brand" onClick={closeDrawer}>
          <span>🏛️ WealthFlow</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="links">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
            end
          >
            📊 Dashboard
          </NavLink>

          {/* Investments Dropdown */}
          <div className="nav-item-dropdown">
            <button className="nav-dropdown-trigger">
              💼 Investments <span className="nav-arrow">▼</span>
            </button>
            <div className="dropdown-menu">
              <NavLink to="/equities" className="dropdown-item" onClick={closeDrawer}>
                <span className="dropdown-item-icon">📈</span> Indian Equities
              </NavLink>
              <NavLink to="/mutual-funds" className="dropdown-item" onClick={closeDrawer}>
                <span className="dropdown-item-icon">💼</span> Mutual Funds
              </NavLink>
              <NavLink to="/debt-funds" className="dropdown-item" onClick={closeDrawer}>
                <span className="dropdown-item-icon">🏛️</span> Debt Funds
              </NavLink>
              <NavLink to="/foreign-portfolio" className="dropdown-item" onClick={closeDrawer}>
                <span className="dropdown-item-icon">🌍</span> International Portfolio
              </NavLink>
            </div>
          </div>

          {/* Markets Dropdown */}
          <div className="nav-item-dropdown">
            <button className="nav-dropdown-trigger">
              📈 Markets <span className="nav-arrow">▼</span>
            </button>
            <div className="dropdown-menu">
              <NavLink to="/global-indexes" className="dropdown-item" onClick={closeDrawer}>
                <span className="dropdown-item-icon">🌐</span> Global Indexes
              </NavLink>
            </div>
          </div>

          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            👤 About
          </NavLink>
        </div>

        {/* Hamburger Menu Icon (Mobile) */}
        <button
          className={`hamburger-btn ${drawerOpen ? 'open' : ''}`}
          onClick={toggleDrawer}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Drawer Overlay & Sidebar */}
      <div className={`drawer-backdrop ${drawerOpen ? 'open' : ''}`} onClick={closeDrawer}>
        <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="drawer-header">
            <div className="brand"><span>🏛️ WealthFlow</span></div>
            <button className="btn btn-outline" onClick={closeDrawer} style={{ padding: '4px 8px' }}>
              ✕
            </button>
          </div>
          <div className="drawer-links">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
              onClick={closeDrawer}
              end
            >
              📊 Dashboard
            </NavLink>

            <div className="drawer-category">Investments</div>
            <NavLink to="/equities" onClick={closeDrawer}>
              📈 Indian Equities
            </NavLink>
            <NavLink to="/mutual-funds" onClick={closeDrawer}>
              💼 Mutual Funds
            </NavLink>
            <NavLink to="/debt-funds" onClick={closeDrawer}>
              🏛️ Debt Funds
            </NavLink>
            <NavLink to="/foreign-portfolio" onClick={closeDrawer}>
              🌍 International Portfolio
            </NavLink>

            <div className="drawer-category">Markets</div>
            <NavLink to="/global-indexes" onClick={closeDrawer}>
              🌐 Global Indexes
            </NavLink>

            <div className="drawer-category">Profile</div>
            <NavLink to="/about" onClick={closeDrawer}>
              👤 About
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}

