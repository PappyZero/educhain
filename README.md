# EduChain: Decentralized Credential Verification and Micro-Certification Platform

A blockchain-based academic transcript issuance and verification system built on the **BlockDAG Awakening Testnet** (Chain ID: 1043). Universities can issue tamper-proof credentials as NFTs, and employers or institutions can instantly verify them.

## Features

- **NFT-Based Credentials**: Each academic credential is minted as a unique ERC-721 NFT
- **IPFS Metadata Storage**: Transcript data stored on IPFS with Pinata integration
- **Blockchain Verification**: Instant on-chain credential verification
- **QR Code Support**: Generate and scan QR codes for quick verification
- **Authorized Issuers**: Only authorized universities can mint credentials
- **MetaMask Integration**: Connect to BlockDAG Testnet via MetaMask

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Blockchain**: Ethers.js v6
- **IPFS**: Pinata API
- **QR Codes**: qrcode library
- **Routing**: React Router DOM

## Prerequisites

- Node.js 18+ and npm
- MetaMask browser extension
- BlockDAG Testnet added to MetaMask

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your deployed contract addresses:

```env
VITE_CREDENTIAL_NFT_ADDRESS=0xYourCredentialNFTAddress
VITE_VERIFICATION_CONTRACT_ADDRESS=0xYourVerificationContractAddress
```

Optionally, add Pinata API credentials for real IPFS uploads:

```env
VITE_PINATA_API_KEY=your_api_key_here
VITE_PINATA_SECRET_KEY=your_secret_key_here
```

### 3. Add BlockDAG Testnet to MetaMask

The app will automatically prompt you to add the network, or you can add it manually:

- **Network Name:** Awakening Testnet
- **Chain ID:** 1043
- **RPC URL:** [https://rpc.awakening.bdagscan.com](https://rpc.awakening.bdagscan.com/)
- **Relayer RPC URL:** relay.awakening.bdagscan.com
- **Explorer:** [https://awakening.bdagscan.com](https://awakening.bdagscan.com/)
- **Currency Symbol:** BDAG
- **Faucet:** https://awakening.bdagscan.com/faucet

**External RPC (via NowNodes):** https://nownodes.io/nodes/bdag-blockdag

### 4. Run the Application

```bash
npm run dev
```

Visit `http://localhost:5173` to access the application.

## Smart Contracts

### CredentialNFT.sol

The main NFT contract for issuing credentials.

**Key Functions:**
- `authorizeIssuer(address)` - Owner authorizes a university to issue credentials
- `mintCredential(address recipient, string memory tokenURI)` - Mint a new credential NFT
- `tokenURI(uint256 tokenId)` - Get IPFS metadata URI for a credential

**Events:**
- `CredentialMinted(uint256 tokenId, address recipient, address issuer, string tokenURI)`

### VerificationContract.sol

Contract for verifying credential ownership.

**Key Functions:**
- `verifyOwnership(address user, uint256 tokenId)` - Check if a user owns a credential
- `getCredentialDetails(uint256 tokenId)` - Get owner and metadata URI for a credential

## Usage Guide

### For Universities (Authorized Issuers)

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection
2. **Navigate to Issue**: Go to "Issue Credential" page
3. **Fill Form**: Enter student details, degree info, and upload transcript (optional)
4. **Add IPFS Keys** (optional): Add Pinata API credentials or leave empty for simulation
5. **Issue Credential**: Submit form to mint the credential NFT
6. **Download QR Code**: Save the verification QR code for the student

### For Employers/Verifiers

1. **Connect Wallet**: Connect MetaMask to the BlockDAG Testnet
2. **Navigate to Verify**: Go to "Verify Credential" page
3. **Enter Token ID**: Input the credential's Token ID (or scan QR code)
4. **Optional Ownership Check**: Enter an address to verify ownership
5. **View Results**: See credential details, issuer, and blockchain proof

## Project Structure

```
project/
├── src/
│   ├── components/
│   │   ├── Header.tsx               # Navigation and wallet connection
│   │   ├── IssueCredential.tsx      # Credential issuance form
│   │   ├── VerifyCredential.tsx     # Credential verification interface
│   │   └── QRCodeGenerator.tsx      # QR code generation component
│   ├── contexts/
│   │   └── WalletContext.tsx        # Wallet state management
│   ├── contracts/
│   │   ├── CredentialNFT.json       # NFT contract ABI
│   │   └── VerificationContract.json # Verification contract ABI
│   ├── pages/
│   │   ├── Home.tsx                 # Landing page
│   │   ├── IssuePage.tsx            # Issue credential page
│   │   └── VerifyPage.tsx           # Verify credential page
│   ├── services/
│   │   └── ipfsService.ts           # IPFS upload/fetch functions
│   ├── utils/
│   │   └── contractHelpers.ts       # Contract interaction utilities
│   ├── App.tsx                      # Main app component
│   └── main.tsx                     # App entry point
├── .env.example                     # Environment variable template
└── package.json
```

## IPFS Integration

The system supports both **real IPFS uploads** (via Pinata) and **simulated uploads** (localStorage):

- **With Pinata Keys**: Uploads metadata and files to IPFS via Pinata API
- **Without Keys**: Simulates IPFS by storing data in browser localStorage (for demo purposes)

## Development

### Build for Production

```bash
npm run build
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

## Smart Contract Deployment

To deploy the smart contracts:

1. **Install Foundry** (recommended) or Hardhat
2. **Compile Contracts**: `forge build`
3. **Deploy to BlockDAG Testnet**: Use deployment script with RPC URL
4. **Authorize Issuers**: Call `authorizeIssuer()` from contract owner
5. **Update `.env`**: Add deployed contract addresses

## Security Considerations

- Only authorized addresses can mint credentials
- Credentials are immutable once minted
- IPFS ensures decentralized metadata storage
- All transactions are transparent on the blockchain
- Private keys never leave the user's wallet

## Future Enhancements

- Multi-chain deployment (Ethereum, Polygon, etc.)
- Credential revocation system
- Batch credential issuance
- Advanced credential privacy features
- Integration with university student information systems
- Mobile app with QR scanner

## License

MIT

## Support

For issues, questions, or contributions, please open an issue on GitHub.
