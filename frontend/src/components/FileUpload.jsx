import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { importGoogleSheet } from '../utils/googleApi';

export default function FileUpload({ onDataLoaded }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [showSheetsInput, setShowSheetsInput] = useState(false);
  const [sheetUrl, setSheetUrl] = useState('');
  const [importingSheet, setImportingSheet] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = useCallback((file) => {
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
  }, [onDataLoaded]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const parseCsvText = useCallback((csvText) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          const cols = Object.keys(results.data[0]);
          onDataLoaded(results.data, cols);
        } else {
          setError('The spreadsheet appears to be empty.');
        }
      },
      error: (err) => {
        setError(`Failed to parse sheet data: ${err.message}`);
      },
    });
  }, [onDataLoaded]);

  const handleGoogleSheetsImport = async () => {
    if (!sheetUrl.trim()) {
      setError('Please enter a Google Sheets URL.');
      return;
    }

    const sheetIdMatch = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!sheetIdMatch) {
      setError('Invalid Google Sheets URL. Make sure it contains /spreadsheets/d/SPREADSHEET_ID');
      return;
    }

    const spreadsheetId = sheetIdMatch[1];
    const exportUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;

    setImportingSheet(true);
    setError('');

    try {
      // Prefer backend Google Sheets API (authenticated proxy)
      try {
        const data = await importGoogleSheet(sheetUrl);
        if (data.csv) {
          parseCsvText(data.csv);
          return;
        }
      } catch {
        // Fall back to direct public CSV export
      }

      const response = await fetch(exportUrl);
      if (!response.ok) {
        throw new Error('Could not fetch spreadsheet. Make sure sharing is set to "Anyone with the link can view".');
      }
      const csvText = await response.text();
      parseCsvText(csvText);
    } catch (err) {
      setError(err.message || 'Failed to import Google Sheet.');
    } finally {
      setImportingSheet(false);
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
        <UploadCloud color="var(--accent)" /> 
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
        <p style={{ color: 'var(--text-2)', marginTop: '0.5rem' }}>
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
        <div style={{ color: '#f87171', marginTop: '1rem', textAlign: 'center', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          <span style={{ padding: '0 1rem', color: 'var(--text-2)', fontSize: '0.85rem' }}>OR CLOUD IMPORT</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
        </div>
        
        {showSheetsInput ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input
              type="text"
              className="text-input"
              placeholder="Paste Google Sheets Share Link (Anyone with link can view)"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              disabled={importingSheet}
              style={{ fontSize: '0.85rem', padding: '0.75rem', width: '100%' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn-primary"
                onClick={handleGoogleSheetsImport}
                disabled={importingSheet}
                style={{ flex: 1, fontSize: '0.85rem', padding: '0.65rem' }}
              >
                {importingSheet ? 'Importing...' : 'Load Google Sheet'}
              </button>
              <button
                className="btn-secondary"
                onClick={() => { setShowSheetsInput(false); setError(''); }}
                disabled={importingSheet}
                style={{ fontSize: '0.85rem', padding: '0.65rem' }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button 
            className="btn-secondary" 
            onClick={() => setShowSheetsInput(true)}
            style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg" alt="Google Sheets" style={{ width: '20px', height: '20px' }} />
            Import from Google Sheets
          </button>
        )}
      </div>
    </motion.div>
  );
}
