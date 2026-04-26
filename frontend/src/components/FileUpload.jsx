import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FileUpload({ onDataLoaded }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = (file) => {
    if (!file || file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      return;
    }

    setError('');
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          const columns = Object.keys(results.data[0]);
          onDataLoaded(results.data, columns);
        } else {
          setError('The CSV file appears to be empty.');
        }
      },
      error: (err) => {
        setError(`Failed to parse CSV: ${err.message}`);
      }
    });
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [onDataLoaded]);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <motion.div 
      className="glass-panel animate-fade-in"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <UploadCloud color="var(--accent-color)" /> 
        Upload Dataset
      </h2>
      
      <div 
        className={`dropzone ${isDragging ? 'active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('csv-upload').click()}
      >
        <UploadCloud size={48} className="dropzone-icon" />
        <h3>Drag & Drop your CSV here</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          or click to browse from your computer
        </p>
        <input 
          id="csv-upload" 
          type="file" 
          accept=".csv" 
          style={{ display: 'none' }} 
          onChange={handleFileInput}
        />
      </div>

      {error && (
        <div style={{ color: 'var(--danger-color)', marginTop: '1rem', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          <span style={{ padding: '0 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>OR CLOUD IMPORT</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
        </div>
        
        <button 
          className="btn-secondary" 
          onClick={() => alert("Google Drive Picker API would launch here. Please configure your Google Cloud Client ID to enable cloud imports.")}
          style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#1a1a1a', border: '1px solid #333' }}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" alt="Google Drive" style={{ width: '20px', height: '20px' }} />
          Import from Google Workspace
        </button>
      </div>
    </motion.div>
  );
}
