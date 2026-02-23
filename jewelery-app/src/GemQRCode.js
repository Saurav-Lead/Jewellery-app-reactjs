import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const GemQRCode = ({ productId, productName }) => {
  // Construct the URL that the QR code will open
  // This points to the Product Detail page on your Render site
  const detailUrl = `${window.location.origin}/product/${productId}`;

  return (
    <div className="qr-container" style={{ textAlign: 'center', padding: '20px' }}>
      <h4>Immersive details: {productName}</h4>
      <QRCodeCanvas 
        value={detailUrl} 
        size={200} 
        level={"H"} // High error correction (good for physical printing)
        includeMargin={true}
        imageSettings={{
          src: "/logo-small.png", // Optional: put your logo in the middle
          height: 40,
          width: 40,
          excavate: true,
        }}
      />
      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        Scan to view immersive detail of the product.
      </p>
    </div>
  );
};

export default GemQRCode;