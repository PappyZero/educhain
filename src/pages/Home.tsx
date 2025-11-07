import { Link } from 'react-router-dom';
import { Shield, Upload, Search, Award, Lock, Globe } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            EduChain
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Decentralized Academic Transcript Issuance & Verification System
          </p>
          <p className="text-lg text-gray-500 mt-2">
            Blockchain-backed credentials on BlockDAG Awakening Testnet
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Link
            to="/issue"
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-blue-500"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Issue Credentials</h2>
            </div>
            <p className="text-gray-600">
              Authorized universities can mint blockchain-backed academic credentials as NFTs with IPFS metadata storage.
            </p>
          </Link>

          <Link
            to="/verify"
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-green-500"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Search className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Verify Credentials</h2>
            </div>
            <p className="text-gray-600">
              Employers and institutions can instantly verify academic credentials on-chain or via QR code scanning.
            </p>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">1. University Issues</h3>
              <p className="text-gray-600">
                Authorized universities upload transcript data to IPFS and mint NFT credentials to student wallets.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">2. Blockchain Storage</h3>
              <p className="text-gray-600">
                Credentials are stored immutably on the BlockDAG blockchain with metadata on IPFS.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">3. Instant Verification</h3>
              <p className="text-gray-600">
                Anyone can verify credential authenticity and ownership through the blockchain in seconds.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <Shield className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Tamper-Proof Records</h3>
                <p className="text-gray-600 text-sm">
                  Credentials stored on blockchain cannot be altered or forged
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Globe className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Decentralized Storage</h3>
                <p className="text-gray-600 text-sm">
                  IPFS integration ensures permanent and accessible transcript data
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Award className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">NFT-Based Credentials</h3>
                <p className="text-gray-600 text-sm">
                  Each credential is a unique, transferable NFT owned by the graduate
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Search className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">QR Code Verification</h3>
                <p className="text-gray-600 text-sm">
                  Quick verification via QR code scanning for instant validation
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">MVP Demo Version</h3>
            <p className="text-blue-700 text-sm">
              This is a demonstration running on BlockDAG Awakening Testnet (Chain ID: 1043).
              Connect your MetaMask wallet to get started.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
