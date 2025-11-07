interface CredentialMetadata {
  name: string;
  description: string;
  recipient: string;
  issuer: string;
  issueDate: string;
  degreeType?: string;
  major?: string;
  gpa?: string;
  graduationDate?: string;
  transcriptFile?: string;
}

export async function uploadToIPFS(
  metadata: CredentialMetadata,
  pinataApiKey?: string,
  pinataSecretKey?: string
): Promise<string> {
  if (!pinataApiKey || !pinataSecretKey) {
    return simulateIPFSUpload(metadata);
  }

  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretKey,
      },
      body: JSON.stringify({
        pinataContent: {
          ...metadata,
          timestamp: new Date().toISOString(),
        },
        pinataMetadata: {
          name: `Credential-${metadata.recipient}-${Date.now()}`,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to upload to Pinata');
    }

    const data = await response.json();
    return `ipfs://${data.IpfsHash}`;
  } catch (error) {
    console.error('IPFS upload error:', error);
    return simulateIPFSUpload(metadata);
  }
}

function simulateIPFSUpload(metadata: CredentialMetadata): string {
  const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  console.log('Simulated IPFS upload:', { metadata, hash: mockHash });

  if (typeof window !== 'undefined') {
    const existingData = JSON.parse(localStorage.getItem('ipfsSimulation') || '{}');
    existingData[mockHash] = metadata;
    localStorage.setItem('ipfsSimulation', JSON.stringify(existingData));
  }

  return `ipfs://${mockHash}`;
}

export async function fetchFromIPFS(tokenURI: string): Promise<CredentialMetadata | null> {
  try {
    if (tokenURI.startsWith('ipfs://')) {
      const hash = tokenURI.replace('ipfs://', '');

      if (typeof window !== 'undefined') {
        const simulatedData = JSON.parse(localStorage.getItem('ipfsSimulation') || '{}');
        if (simulatedData[hash]) {
          return simulatedData[hash];
        }
      }

      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`);
      if (response.ok) {
        return await response.json();
      }
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch from IPFS:', error);
    return null;
  }
}

export async function uploadFileToIPFS(
  file: File,
  pinataApiKey?: string,
  pinataSecretKey?: string
): Promise<string> {
  if (!pinataApiKey || !pinataSecretKey) {
    return simulateFileUpload(file);
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pinataMetadata', JSON.stringify({
      name: file.name,
    }));

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretKey,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file to Pinata');
    }

    const data = await response.json();
    return `ipfs://${data.IpfsHash}`;
  } catch (error) {
    console.error('File upload error:', error);
    return simulateFileUpload(file);
  }
}

function simulateFileUpload(file: File): string {
  const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}file${Math.random().toString(36).substring(2, 15)}`;
  console.log('Simulated file upload:', { fileName: file.name, hash: mockHash });
  return `ipfs://${mockHash}`;
}
