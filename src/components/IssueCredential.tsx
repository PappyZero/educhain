import { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { mintCredential, checkIsAuthorizedIssuer, getExplorerUrl } from '../utils/contractHelpers';
import { uploadToIPFS, uploadFileToIPFS } from '../services/ipfsService';
import { FileText, Upload, Loader2 } from 'lucide-react';
import QRCodeGenerator from './QRCodeGenerator';

export default function IssueCredential() {
  const { signer, account } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [mintedCredential, setMintedCredential] = useState<{
    tokenId: string;
    txHash: string;
    tokenURI: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    recipientAddress: '',
    recipientName: '',
    degreeType: '',
    major: '',
    gpa: '',
    graduationDate: '',
    description: '',
    pinataApiKey: '',
    pinataSecretKey: '',
  });

  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);

  const checkAuthorization = async () => {
    if (!signer || !account) return;
    const authorized = await checkIsAuthorizedIssuer(signer, account);
    setIsAuthorized(authorized);
  };

  useState(() => {
    if (signer && account) {
      checkAuthorization();
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTranscriptFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signer || !account) {
      alert('Please connect your wallet first');
      return;
    }

    if (isAuthorized === false) {
      alert('Your address is not authorized to issue credentials. Please contact the contract owner.');
      return;
    }

    setIsLoading(true);

    try {
      let transcriptFileURI = '';
      if (transcriptFile) {
        transcriptFileURI = await uploadFileToIPFS(
          transcriptFile,
          formData.pinataApiKey || undefined,
          formData.pinataSecretKey || undefined
        );
      }

      const metadata = {
        name: `${formData.degreeType} - ${formData.recipientName}`,
        description: formData.description,
        recipient: formData.recipientAddress,
        issuer: account,
        issueDate: new Date().toISOString(),
        degreeType: formData.degreeType,
        major: formData.major,
        gpa: formData.gpa,
        graduationDate: formData.graduationDate,
        transcriptFile: transcriptFileURI,
      };

      const tokenURI = await uploadToIPFS(
        metadata,
        formData.pinataApiKey || undefined,
        formData.pinataSecretKey || undefined
      );

      const { tokenId, txHash } = await mintCredential(signer, formData.recipientAddress, tokenURI);

      setMintedCredential({ tokenId, txHash, tokenURI });

      setFormData({
        recipientAddress: '',
        recipientName: '',
        degreeType: '',
        major: '',
        gpa: '',
        graduationDate: '',
        description: '',
        pinataApiKey: formData.pinataApiKey,
        pinataSecretKey: formData.pinataSecretKey,
      });
      setTranscriptFile(null);
    } catch (error: any) {
      console.error('Error issuing credential:', error);
      alert(`Failed to issue credential: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please connect your wallet to issue credentials</p>
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Not Authorized</h3>
        <p className="text-yellow-700">
          Your address ({account}) is not authorized to issue credentials. Please contact the contract owner to get authorized.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {!mintedCredential ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Issue Academic Credential</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Wallet Address *
              </label>
              <input
                type="text"
                name="recipientAddress"
                value={formData.recipientAddress}
                onChange={handleInputChange}
                placeholder="0x..."
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Name *
              </label>
              <input
                type="text"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Degree Type *
              </label>
              <input
                type="text"
                name="degreeType"
                value={formData.degreeType}
                onChange={handleInputChange}
                placeholder="Bachelor of Science"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Major *
              </label>
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleInputChange}
                placeholder="Computer Science"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GPA
              </label>
              <input
                type="text"
                name="gpa"
                value={formData.gpa}
                onChange={handleInputChange}
                placeholder="3.85"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Graduation Date *
              </label>
              <input
                type="date"
                name="graduationDate"
                value={formData.graduationDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Additional details about this credential..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transcript File (PDF)
              </label>
              <div className="flex items-center gap-4">
                <label className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <FileText className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {transcriptFile ? transcriptFile.name : 'Choose file...'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pinata API Key (Optional)
              </label>
              <input
                type="text"
                name="pinataApiKey"
                value={formData.pinataApiKey}
                onChange={handleInputChange}
                placeholder="Leave empty for simulation"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pinata Secret Key (Optional)
              </label>
              <input
                type="password"
                name="pinataSecretKey"
                value={formData.pinataSecretKey}
                onChange={handleInputChange}
                placeholder="Leave empty for simulation"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-8 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Issuing Credential...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Issue Credential
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Credential Issued Successfully!</h2>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Token ID</p>
              <p className="font-mono text-lg font-semibold text-gray-800">{mintedCredential.tokenId}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Transaction Hash</p>
              <a
                href={getExplorerUrl(mintedCredential.txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-blue-600 hover:text-blue-800 break-all"
              >
                {mintedCredential.txHash}
              </a>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Metadata URI</p>
              <p className="font-mono text-sm text-gray-800 break-all">{mintedCredential.tokenURI}</p>
            </div>
          </div>

          <QRCodeGenerator tokenId={mintedCredential.tokenId} />

          <button
            onClick={() => setMintedCredential(null)}
            className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Issue Another Credential
          </button>
        </div>
      )}
    </div>
  );
}
