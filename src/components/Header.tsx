import { Link } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { GraduationCap, Wallet, LogOut } from 'lucide-react';

export default function Header() {
  const { account, connectWallet, disconnectWallet, isConnecting } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">EduChain</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/issue"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Issue Credential
            </Link>
            <Link
              to="/verify"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Verify Credential
            </Link>
          </nav>

          <div>
            {account ? (
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <p className="text-sm font-mono text-gray-700">{formatAddress(account)}</p>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  title="Disconnect"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Wallet className="w-5 h-5" />
                <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
