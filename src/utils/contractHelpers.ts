import { Contract, JsonRpcSigner } from 'ethers';
import CredentialNFTABI from '../contracts/CredentialNFT.json';
import VerificationContractABI from '../contracts/VerificationContract.json';

export const CONTRACT_ADDRESSES = {
  CredentialNFT: import.meta.env.VITE_CREDENTIAL_NFT_ADDRESS || '0x0000000000000000000000000000000000000000',
  VerificationContract: import.meta.env.VITE_VERIFICATION_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
};

export function getCredentialNFTContract(signer: JsonRpcSigner): Contract {
  return new Contract(CONTRACT_ADDRESSES.CredentialNFT, CredentialNFTABI.abi, signer);
}

export function getVerificationContract(signer: JsonRpcSigner): Contract {
  return new Contract(CONTRACT_ADDRESSES.VerificationContract, VerificationContractABI.abi, signer);
}

export async function mintCredential(
  signer: JsonRpcSigner,
  recipient: string,
  tokenURI: string
): Promise<{ tokenId: string; txHash: string }> {
  const contract = getCredentialNFTContract(signer);

  try {
    const tx = await contract.mintCredential(recipient, tokenURI);
    const receipt = await tx.wait();

    const event = receipt.logs
      .map((log: any) => {
        try {
          return contract.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((parsedLog: any) => parsedLog?.name === 'CredentialMinted');

    const tokenId = event?.args?.tokenId?.toString() || '0';

    return {
      tokenId,
      txHash: receipt.hash,
    };
  } catch (error: any) {
    console.error('Minting error:', error);
    throw new Error(error.reason || error.message || 'Failed to mint credential');
  }
}

export async function verifyCredentialOwnership(
  signer: JsonRpcSigner,
  userAddress: string,
  tokenId: string
): Promise<boolean> {
  const contract = getVerificationContract(signer);

  try {
    return await contract.verifyOwnership(userAddress, tokenId);
  } catch (error) {
    console.error('Verification error:', error);
    return false;
  }
}

export async function getCredentialDetails(
  signer: JsonRpcSigner,
  tokenId: string
): Promise<{ owner: string; tokenURI: string } | null> {
  const contract = getVerificationContract(signer);

  try {
    const [owner, tokenURI] = await contract.getCredentialDetails(tokenId);
    return { owner, tokenURI };
  } catch (error) {
    console.error('Failed to get credential details:', error);
    return null;
  }
}

export async function checkIsAuthorizedIssuer(
  signer: JsonRpcSigner,
  address: string
): Promise<boolean> {
  const contract = getCredentialNFTContract(signer);

  try {
    return await contract.authorizedIssuers(address);
  } catch (error) {
    console.error('Failed to check issuer authorization:', error);
    return false;
  }
}

export function getExplorerUrl(txHash: string): string {
  return `https://explorer-testnet.blockdag.network/tx/${txHash}`;
}

export function getExplorerTokenUrl(tokenId: string): string {
  return `https://explorer-testnet.blockdag.network/token/${CONTRACT_ADDRESSES.CredentialNFT}?a=${tokenId}`;
}
