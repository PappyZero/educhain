import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { getCredentialDetails, verifyCredentialOwnership, getExplorerTokenUrl } from '../utils/contractHelpers';
import { fetchFromIPFS } from '../services/ipfsService';
import { Search, CheckCircle, XCircle, Loader2, Shield, FileText } from 'lucide-react';

export default function VerifyCredential() {
  const { tokenId: urlTokenId } = useParams<{ tokenId: string }>();
  const { signer } = useWallet();

  const [tokenId, setTokenId] = useState(urlTokenId || '');
  const [verificationAddress, setVerificationAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    owner: string;
    metadata: any;
    tokenURI: string;
  } | null>(null);

  useEffect(() => {
    if (urlTokenId && signer) {
      handleVerify(urlTokenId);
    }
  }, [urlTokenId, signer]);

  const handleVerify = async (idToVerify?: string) => {
    const targetTokenId = idToVerify || tokenId;

    if (!targetTokenId) {
      alert('Please enter a Token ID');
      return;
    }

    if (!signer) {
      alert('Please connect your wallet to verify credentials');
      return;
    }

    setIsLoading(true);
    setVerificationResult(null);

    try {
      const details = await getCredentialDetails(signer, targetTokenId);

      if (!details) {
        setVerificationResult({
          isValid: false,
          owner: '',
          metadata: null,
          tokenURI: '',
        });
        setIsLoading(false);
        return;
      }

      const metadata = await fetchFromIPFS(details.tokenURI);

      let isOwnershipValid = true;
      if (verificationAddress) {
        isOwnershipValid = await verifyCredentialOwnership(signer, verificationAddress, targetTokenId);
      }

      setVerificationResult({
        isValid: isOwnershipValid,
        owner: details.owner,
        metadata,
        tokenURI: details.tokenURI,
      });
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult({
        isValid: false,
        owner: '',
        metadata: null,
        tokenURI: '',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Shield className="w-6 h-6 mr-2 text-blue-600" />
          Verify Academic Credential
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Token ID *
            </label>
            <input
              type="text"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="Enter Token ID to verify"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verify Ownership (Optional)
            </label>
            <input
              type="text"
              value={verificationAddress}
              onChange={(e) => setVerificationAddress(e.target.value)}
              placeholder="0x... (leave empty to skip ownership check)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter an address to verify they own this credential
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Verify Credential
              </>
            )}
          </button>
        </form>
      </div>

      {verificationResult && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-center mb-6">
            {verificationResult.isValid && verificationResult.metadata ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-12 h-12 mr-3" />
                <div>
                  <h3 className="text-2xl font-bold">Valid Credential</h3>
                  {verificationAddress && (
                    <p className="text-sm text-green-600">Ownership verified</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <XCircle className="w-12 h-12 mr-3" />
                <div>
                  <h3 className="text-2xl font-bold">Invalid Credential</h3>
                  {verificationAddress && !verificationResult.isValid && (
                    <p className="text-sm text-red-600">Ownership verification failed</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {verificationResult.metadata && (
            <div className="space-y-4">
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Credential Details</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Credential Name</p>
                    <p className="font-semibold text-gray-800">{verificationResult.metadata.name}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Degree Type</p>
                    <p className="font-semibold text-gray-800">{verificationResult.metadata.degreeType || 'N/A'}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Major</p>
                    <p className="font-semibold text-gray-800">{verificationResult.metadata.major || 'N/A'}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">GPA</p>
                    <p className="font-semibold text-gray-800">{verificationResult.metadata.gpa || 'N/A'}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Graduation Date</p>
                    <p className="font-semibold text-gray-800">
                      {verificationResult.metadata.graduationDate
                        ? new Date(verificationResult.metadata.graduationDate).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Issue Date</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(verificationResult.metadata.issueDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Current Owner</p>
                    <p className="font-mono text-sm text-gray-800 break-all">{verificationResult.owner}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Issuer</p>
                    <p className="font-mono text-sm text-gray-800 break-all">{verificationResult.metadata.issuer}</p>
                  </div>

                  {verificationResult.metadata.description && (
                    <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                      <p className="text-sm text-gray-600 mb-1">Description</p>
                      <p className="text-gray-800">{verificationResult.metadata.description}</p>
                    </div>
                  )}

                  {verificationResult.metadata.transcriptFile && (
                    <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                      <p className="text-sm text-gray-600 mb-1">Transcript File</p>
                      <a
                        href={verificationResult.metadata.transcriptFile.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Transcript
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Blockchain Information</h4>

                <div className="bg-gray-50 p-4 rounded-lg mb-3">
                  <p className="text-sm text-gray-600 mb-1">Token ID</p>
                  <p className="font-mono text-gray-800">{tokenId}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-3">
                  <p className="text-sm text-gray-600 mb-1">Metadata URI</p>
                  <p className="font-mono text-sm text-gray-800 break-all">{verificationResult.tokenURI}</p>
                </div>

                <a
                  href={getExplorerTokenUrl(tokenId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  View on BlockDAG Explorer →
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
