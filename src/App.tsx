import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import Header from './components/Header';
import Home from './pages/Home';
import IssuePage from './pages/IssuePage';
import VerifyPage from './pages/VerifyPage';

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/issue" element={<IssuePage />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/verify/:tokenId" element={<VerifyPage />} />
          </Routes>
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;
