import React, { useEffect, useState } from 'react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

const App = () => {
  const [data, setData] = useState([]);
  const [result, setResult] = useState(null);
  const [operation, setOperation] = useState('');
  const [range, setRange] = useState('');
  const [loading, setLoading] = useState(false);
  const [hotInstance, setHotInstance] = useState(null);

  // Fetch cell data from the API
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5001/api/cells')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error fetching data: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        // Handle empty or malformed data
        if (!Array.isArray(data)) {
          console.warn('Unexpected data format:', data);
          setData([[]]);
          return;
        }

        const formattedData = [];
        data.forEach((cell) => {
          if (!formattedData[cell.row]) {
            formattedData[cell.row] = [];
          }
          formattedData[cell.row][cell.column] = cell.value;
        });
        setData(formattedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading data:', err);
        setData([[]]); // Fallback to empty Handsontable format
        setLoading(false);
      });
  }, []);

  // Initialize Handsontable
  useEffect(() => {
    if (data.length === 0) return;

    const container = document.getElementById('hot');
    const hot = new Handsontable(container, {
      data: data.length ? data : [[]],
      rowHeaders: true,
      colHeaders: true,
      contextMenu: true,
      afterChange: (changes) => {
        handleDataChange(changes);
      },
      licenseKey: 'non-commercial-and-evaluation',
    });
    setHotInstance(hot);

    return () => hot.destroy();
  }, [data]);

  // Handle cell data changes and sync with the API
  const handleDataChange = (changes) => {
    if (!changes) return;

    changes.forEach(([row, col, oldValue, newValue]) => {
      if (oldValue !== newValue && newValue !== undefined && newValue !== null) {
        fetch('http://localhost:5001/api/cells', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ row, column: col, value: String(newValue) }),
        }).catch((err) => console.error('Error updating data:', err));
      }
    });
  };

  // Validate range input
  const validateRange = (range) => {
    try {
      const parsed = JSON.parse(range);
      return Array.isArray(parsed) && parsed.every((r) => Array.isArray(r) && r.length === 2);
    } catch {
      return false;
    }
  };

  // Handle mathematical operations
  const handleCalculate = () => {
    if (!validateRange(range)) {
      alert('Invalid range format. Example: [[0,0],[1,1]]');
      return;
    }

    const parsedRange = JSON.parse(range);
    if (parsedRange.length === 0) {
      alert('Range cannot be empty!');
      return;
    }

    fetch('http://localhost:5001/api/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ operation, range: parsedRange }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data || typeof data.result === 'undefined') {
          console.warn('Unexpected result format:', data);
          setResult('Error calculating result');
          return;
        }
        setResult(data.result);
      })
      .catch((err) => {
        console.error('Error calculating result:', err);
        setResult('Error calculating result');
      });
  };

  // Handle data quality operations
  const handleDataQuality = (op) => {
    fetch('http://localhost:5001/api/data-quality', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ operation: op }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.warn('Unexpected data format from data-quality:', data);
          return;
        }
        setData(data);
      })
      .catch((err) => console.error('Error during data quality operation:', err));
  };

  return (
    <div>
      <h1>Google Sheets Clone</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div
          id="hot"
          style={{
            width: '100%',
            height: '500px',
            overflow: 'hidden',
            border: '1px solid #ccc',
          }}
        ></div>
      )}
      <div>
        <h2>Mathematical Operations</h2>
        <input
          type="text"
          placeholder="Enter operation (e.g., SUM)"
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
        />
        <input
          type="text"
          placeholder='Enter range (e.g., [[0,0],[0,1]])'
          value={range}
          onChange={(e) => setRange(e.target.value)}
        />
        <button onClick={handleCalculate}>Calculate</button>
        {result !== null && <p>Result: {result}</p>}
      </div>
      <div>
        <h2>Data Quality Operations</h2>
        <button onClick={() => handleDataQuality('TRIM')}>Trim Whitespace</button>
        <button onClick={() => handleDataQuality('UPPER')}>Uppercase</button>
        <button onClick={() => handleDataQuality('LOWER')}>Lowercase</button>
        <button onClick={() => handleDataQuality('REMOVE_DUPLICATES')}>Remove Duplicates</button>
      </div>
    </div>
  );
};

export default App;
