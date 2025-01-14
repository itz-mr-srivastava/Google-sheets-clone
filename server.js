const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/google-sheets-clone', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Schema and Model
const CellSchema = new mongoose.Schema({
    row: Number,
    column: Number,
    value: String,
    dataType: { type: String, enum: ['number', 'text', 'date'], default: 'text' },
    dependencies: [String],
    styles: {
        bold: Boolean,
        italic: Boolean,
        fontSize: Number,
        color: String,
    },
});

const Cell = mongoose.model('Cell', CellSchema);

// Helper Functions
const performMathOperation = (operation, range, data) => {
    const cells = range.map(([row, col]) => {
        const cell = data.find((cell) => cell.row === row && cell.column === col);
        return cell ? parseFloat(cell.value) || 0 : 0;
    });

    switch (operation) {
        case 'SUM':
            return cells.reduce((a, b) => a + b, 0);
        case 'AVERAGE':
            return cells.reduce((a, b) => a + b, 0) / cells.length;
        case 'MAX':
            return Math.max(...cells);
        case 'MIN':
            return Math.min(...cells);
        case 'COUNT':
            return cells.length;
        default:
            return 0;
    }
};

const performDataQualityOperation = (operation, range, data) => {
    let result = [];

    switch (operation) {
        case 'TRIM':
            result = data.map((cell) => ({ ...cell, value: cell.value.trim() }));
            break;
        case 'UPPER':
            result = data.map((cell) => ({ ...cell, value: cell.value.toUpperCase() }));
            break;
        case 'LOWER':
            result = data.map((cell) => ({ ...cell, value: cell.value.toLowerCase() }));
            break;
        case 'REMOVE_DUPLICATES':
            const seen = new Set();
            result = data.filter((cell) => {
                const key = `${cell.row}-${cell.column} -${cell.value}`;
                if (seen.has(key)) {
                    return false;
                }
                seen.add(key);
                return true;
            });
            break;
        case 'FIND_AND_REPLACE':
            const { findText, replaceText } = range;
            result = data.map((cell) => ({
                ...cell,
                value: cell.value.replace(new RegExp(findText, 'g'), replaceText),
            }));
            break;
        default:
            result = data;
    }

    return result;
};

// API Routes
app.get('/api/cells', async (req, res) => {
    const cells = await Cell.find();
    res.json(cells);
});

app.post('/api/cells', async (req, res) => {
    const { row, column, value, dataType, dependencies, styles } = req.body;
    if (dataType === 'number' && isNaN(value)) {
        return res.status(400).json({ error: 'Value must be a number for numeric cells.' });
    }
    const cell = new Cell({ row, column, value, dataType, dependencies, styles });
    await cell.save();
    res.json(cell);
});

app.post('/api/calculate', async (req, res) => {
    const { operation, range } = req.body;
    const cells = await Cell.find();
    const result = performMathOperation(operation, range, cells);
    res.json({ result });
});

app.post('/api/data-quality', async (req, res) => {
    const { operation, range } = req.body;
    const cells = await Cell.find();
    const result = performDataQualityOperation(operation, range, cells);
    res.json(result);
});

app.listen(6000, () => {
    console.log('Server running on http://localhost:6000');
});