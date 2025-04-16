import React from 'react';
import './App.css';
import QRCodeGenerator from './components/QRCodeGenerator';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>QR Code Generator App</h1>
      </header>
      <main>
        <QRCodeGenerator />
      </main>
    </div>
  );
}

export default App;
