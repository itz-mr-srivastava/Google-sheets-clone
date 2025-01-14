import React, { useEffect, useState } from 'react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

const App = () => {
  const [data, setData] = useState([]);
  const [operation, setOperation] = useState('');
  const [range, setRange] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch('http://localhost:6000/api/cells')
      .then((res) => res.json())
      .then((data) => {
        const formattedData = [];
        data.forEach((cell) => {
          if (!formattedData[cell.row]) {
            formattedData[cell.row] = [];
          }
          formattedData[cell.row][cell.column] = cell.value;
        });
        setData(formattedData);
        setIsLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch data.');
        setIsLoading(false);
      });
  }, []);

  const handleDataChange = (changes) => {
    if (!changes) return;
    changes.forEach(([row, col, oldValue, newValue]) => {
      if (oldValue !== newValue) {
        fetch('http://localhost:6000/api/cells', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ row, column: col, value: newValue }),
        })
          .then((res) => {
            if (!res.ok) {
              setError('Invalid input for the selected data type.');
            } else {
              setError(null);
            }
          })
          .catch(() => setError('Failed to update the cell.'));
      }
    });
  };

  const handleOperation = () => {
    try {
      const parsedRange = JSON.parse(range);
      if (!Array.isArray(parsedRange)) {
        throw new Error('Range must be a valid 2D array.');
      }
      setIsLoading(true);
      fetch('http://localhost:6000/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ operation, range: parsedRange }),
      })
        .then((res) => res.json())
        .then((data) => {
          setResult(data.result);
          setIsLoading(false);
        })
        .catch(() => {
          setError('Failed to perform the operation.');
          setIsLoading(false);
        });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Google Sheets Clone</h1>
      <div className="toolbar">
        <input
          type="text"
          placeholder="Enter operation (e.g., SUM)"
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter range (e.g., [[0,0],[0,1]])"
          value={range}
          onChange={(e) => setRange(e.target.value)}
        />
        <button onClick={handleOperation} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Perform Operation'}
        </button>
        {result !== null && <p>Result: {result}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <div
        id="hot"
        style={{ width: '100%', height: '500px' }}
        ref={(element) => {
          if (element) {
            new Handsontable(element, {
              data,
              rowHeaders: true,
              colHeaders: true,
              contextMenu: true,
              afterChange: (changes) => {
                handleDataChange(changes);
              },
            });
          }
        }}
      ></div>
    </div>
  );
};

export default App;
