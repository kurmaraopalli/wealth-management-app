import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Equities from './pages/Equities';
import MutualFunds from './pages/MutualFunds';
import DebtFunds from './pages/DebtFunds';
import GlobalIndexes from './pages/GlobalIndexes';
import ForeignPortfolio from './pages/ForeignPortfolio';
import About from './pages/About';

function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/equities" element={<Equities />} />
          <Route path="/mutual-funds" element={<MutualFunds />} />
          <Route path="/debt-funds" element={<DebtFunds />} />
          <Route path="/global-indexes" element={<GlobalIndexes />} />
          <Route path="/foreign-portfolio" element={<ForeignPortfolio />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
