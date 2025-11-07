import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Download } from 'lucide-react';

interface QRCodeGeneratorProps {
  tokenId: string;
}

export default function QRCodeGenerator({ tokenId }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const verificationUrl = `${window.location.origin}/verify/${tokenId}`;

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        verificationUrl,
        {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) console.error('QR Code generation error:', error);
        }
      );
    }
  }, [verificationUrl]);

  const downloadQRCode = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `credential-${tokenId}-qr.png`;
      link.href = url;
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Verification QR Code</h3>
      <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
        <canvas ref={canvasRef} />
      </div>
      <p className="text-sm text-gray-600 mt-3 text-center max-w-md">
        Scan this QR code to verify the credential
      </p>
      <button
        onClick={downloadQRCode}
        className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <Download className="w-4 h-4" />
        Download QR Code
      </button>
    </div>
  );
}
