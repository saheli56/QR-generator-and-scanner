import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Html5QrcodeScanner } from 'html5-qrcode/esm/html5-qrcode-scanner';
import './QRCodeGenerator.css';

const QRCodeGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [activeTab, setActiveTab] = useState('generate'); // 'generate' or 'scan'
  const [scanResult, setScanResult] = useState('');
  const [qrOptions, setQrOptions] = useState({
    size: 256,
    level: 'H',
    bgColor: '#ffffff',
    fgColor: '#000000',
    includeMargin: true,
    marginSize: 4,
  });

  useEffect(() => {
    if (activeTab === 'scan') {
      const scanner = new Html5QrcodeScanner('qr-reader', {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 10,
      });

      scanner.render(onScanSuccess, onScanError);

      return () => {
        scanner.clear();
      };
    }
  }, [activeTab]);

  const onScanSuccess = (decodedText) => {
    setScanResult(decodedText);
  };

  const onScanError = (error) => {
    console.warn(`QR Code scanning error: ${error}`);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleOptionChange = (option, value) => {
    setQrOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const handleDownload = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = qrOptions.size;
      canvas.height = qrOptions.size;
      ctx.fillStyle = qrOptions.bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'qr-code.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className="qr-code-generator">
      <h2>QR Code Generator & Scanner</h2>

      <div className="tab-container">
        <button
          className={`tab-button ${activeTab === 'generate' ? 'active' : ''}`}
          onClick={() => setActiveTab('generate')}
        >
          Generate QR Code
        </button>
        <button
          className={`tab-button ${activeTab === 'scan' ? 'active' : ''}`}
          onClick={() => setActiveTab('scan')}
        >
          Scan QR Code
        </button>
      </div>

      {activeTab === 'generate' ? (
        <>
          <div className="input-container">
            <input
              type="text"
              className="input-field"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Enter text or URL"
            />
            {inputText && isValidUrl(inputText) && (
              <div className="url-warning">
                This appears to be a URL. Make sure it's correct before generating the QR code.
              </div>
            )}
          </div>

          <div className="button-container">
            <button
              className="generate-button"
              onClick={() => setShowOptions(!showOptions)}
              disabled={!inputText}
            >
              {showOptions ? 'Hide Options' : 'Show Options'}
            </button>
            <button
              className="options-button"
              onClick={() => setShowOptions(!showOptions)}
            >
              Customize QR Code
            </button>
          </div>

          {showOptions && (
            <div className="options-container">
              <div className="option-group">
                <label>Size:</label>
                <input
                  type="range"
                  min="128"
                  max="512"
                  value={qrOptions.size}
                  onChange={(e) => handleOptionChange('size', parseInt(e.target.value))}
                />
                <span>{qrOptions.size}px</span>
              </div>

              <div className="option-group">
                <label>Error Correction:</label>
                <select
                  value={qrOptions.level}
                  onChange={(e) => handleOptionChange('level', e.target.value)}
                >
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
              </div>

              <div className="option-group">
                <label>Foreground Color:</label>
                <input
                  type="color"
                  value={qrOptions.fgColor}
                  onChange={(e) => handleOptionChange('fgColor', e.target.value)}
                />
              </div>

              <div className="option-group">
                <label>Background Color:</label>
                <input
                  type="color"
                  value={qrOptions.bgColor}
                  onChange={(e) => handleOptionChange('bgColor', e.target.value)}
                />
              </div>

              <div className="option-group">
                <label>Margin Size:</label>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={qrOptions.marginSize}
                  onChange={(e) => handleOptionChange('marginSize', parseInt(e.target.value))}
                />
                <span>{qrOptions.marginSize}px</span>
              </div>
            </div>
          )}

          {inputText && (
            <div className="qr-code-container">
              <QRCodeSVG
                id="qr-code-svg"
                value={inputText}
                size={qrOptions.size}
                level={qrOptions.level}
                bgColor={qrOptions.bgColor}
                fgColor={qrOptions.fgColor}
                includeMargin={qrOptions.includeMargin}
                marginSize={qrOptions.marginSize}
              />
              <button className="download-button" onClick={handleDownload}>
                Download QR Code
              </button>
              {isValidUrl(inputText) && (
                <div className="url-info">
                  This QR code will link to: <a href={inputText} target="_blank" rel="noopener noreferrer">{inputText}</a>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="scanner-container">
          <div id="qr-reader" className="qr-reader"></div>
          {scanResult && (
            <div className="scan-result">
              <h3>Scanned Result:</h3>
              <p>{scanResult}</p>
              {isValidUrl(scanResult) && (
                <a href={scanResult} target="_blank" rel="noopener noreferrer" className="scan-link">
                  Open Link
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator; 