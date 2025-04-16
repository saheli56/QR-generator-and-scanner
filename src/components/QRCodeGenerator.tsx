import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './QRCodeGenerator.css';

interface QRCodeOptions {
  size: number;
  level: 'L' | 'M' | 'Q' | 'H';
  includeMargin: boolean;
  bgColor: string;
  fgColor: string;
}

const QRCodeGenerator: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [isValidUrl, setIsValidUrl] = useState<boolean>(false);
  const [showQR, setShowQR] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [options, setOptions] = useState<QRCodeOptions>({
    size: 256,
    level: 'H',
    includeMargin: true,
    bgColor: '#FFFFFF',
    fgColor: '#000000'
  });

  const formatUrl = (url: string): string => {
    // Remove any whitespace
    url = url.trim();
    
    // Check if the URL starts with http:// or https://
    if (!url.match(/^https?:\/\//i)) {
      url = 'https://' + url;
    }
    
    return url;
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputText(value);
    setShowQR(false);
    
    if (value) {
      const formattedUrl = formatUrl(value);
      setIsValidUrl(validateUrl(formattedUrl));
    } else {
      setIsValidUrl(false);
    }
  };

  const handleGenerate = () => {
    if (inputText.trim()) {
      setShowQR(true);
    }
  };

  const handleOptionChange = (option: keyof QRCodeOptions, value: any) => {
    setOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'qr-code.png';
      link.href = url;
      link.click();
    }
  };

  const getQrValue = (): string => {
    if (!inputText) return '';
    return isValidUrl ? formatUrl(inputText) : inputText;
  };

  return (
    <div className="qr-code-generator">
      <h2>QR Code Generator</h2>
      <div className="input-container">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter URL or text to generate QR code"
          className="input-field"
        />
        <div className="button-container">
          <button 
            className="generate-button"
            onClick={handleGenerate}
            disabled={!inputText.trim()}
          >
            Generate QR Code
          </button>
          <button 
            className="options-button"
            onClick={() => setShowOptions(!showOptions)}
          >
            {showOptions ? 'Hide Options' : 'Show Options'}
          </button>
        </div>
        {inputText && !isValidUrl && (
          <p className="url-warning">
            Note: If you're entering a URL, make sure it's a valid web address
          </p>
        )}
      </div>

      {showOptions && (
        <div className="options-container">
          <div className="option-group">
            <label>Size:</label>
            <input
              type="range"
              min="128"
              max="512"
              value={options.size}
              onChange={(e) => handleOptionChange('size', parseInt(e.target.value))}
            />
            <span>{options.size}px</span>
          </div>
          <div className="option-group">
            <label>Error Correction:</label>
            <select
              value={options.level}
              onChange={(e) => handleOptionChange('level', e.target.value)}
            >
              <option value="L">Low (7%)</option>
              <option value="M">Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H">High (30%)</option>
            </select>
          </div>
          <div className="option-group">
            <label>Background Color:</label>
            <input
              type="color"
              value={options.bgColor}
              onChange={(e) => handleOptionChange('bgColor', e.target.value)}
            />
          </div>
          <div className="option-group">
            <label>Foreground Color:</label>
            <input
              type="color"
              value={options.fgColor}
              onChange={(e) => handleOptionChange('fgColor', e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="qr-code-container">
        {showQR && inputText && (
          <>
            <QRCodeSVG
              value={getQrValue()}
              size={options.size}
              level={options.level}
              includeMargin={options.includeMargin}
              bgColor={options.bgColor}
              fgColor={options.fgColor}
            />
            {isValidUrl && (
              <p className="url-info">
                This QR code will redirect to: <a href={getQrValue()} target="_blank" rel="noopener noreferrer">{getQrValue()}</a>
              </p>
            )}
            <button 
              className="download-button"
              onClick={handleDownload}
            >
              Download QR Code
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QRCodeGenerator; 