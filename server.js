const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
try {
    mongoose.connect('mongodb://localhost:27017/google-sheets-clone', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
} catch (error) {
    console.error("MongoDB connection error:", error);
}

// Schema and Model
const CellSchema = new mongoose.Schema({
    row: Number,
    column: Number,
    value: String,
    dependencies: [String],
});

const Cell = mongoose.model('Cell', CellSchema);

// Helper Function for Mathematical Operations
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

// Helper Functions for Data Quality
const performDataQualityOperation = (operation, data) => {
    switch (operation) {
        case 'TRIM':
            return data.map((cell) => ({ ...cell, value: cell.value.trim() }));
        case 'UPPER':
            return data.map((cell) => ({ ...cell, value: cell.value.toUpperCase() }));
        case 'LOWER':
            return data.map((cell) => ({ ...cell, value: cell.value.toLowerCase() }));
        case 'REMOVE_DUPLICATES':
            return Array.from(new Set(data.map((cell) => JSON.stringify(cell)))).map((cell) => JSON.parse(cell));
        default:
            return data;
    }
};

// API Routes
app.get('/api/cells', async (req, res) => {
    try {
        const cells = await Cell.find();
        res.json(cells.length ? cells : []); // Return an empty array if no data is found
    } catch (error) {
        console.error("Error fetching cells:", error);
        res.status(500).json({ error: "Error fetching cells" }); // Ensure valid JSON error response
    }
});


app.post('/api/cells', async (req, res) => {
    try {
        const { row, column, value, dependencies } = req.body;
        const cell = new Cell({ row, column, value, dependencies });
        await cell.save();
        res.json(cell);
    } catch (error) {
        console.error("Error saving cell:", error);
        res.status(500).send("Error saving cell");
    }
});

app.put('/api/cells/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { value } = req.body;
        const cell = await Cell.findByIdAndUpdate(id, { value }, { new: true });
        res.json(cell);
    } catch (error) {
        console.error("Error updating cell:", error);
        res.status(500).send("Error updating cell");
    }
});

app.post('/api/calculate', async (req, res) => {
    try {
        const { operation, range } = req.body;
        const cells = await Cell.find();
        const result = performMathOperation(operation, range, cells);
        res.json({ result });
    } catch (error) {
        console.error("Error calculating operation:", error);
        res.status(500).send("Error calculating operation");
    }
});

app.post('/api/data-quality', async (req, res) => {
    try {
        const { operation } = req.body;
        let cells = await Cell.find();
        cells = performDataQualityOperation(operation, cells);
        res.json(cells);
    } catch (error) {
        console.error("Error performing data quality operation:", error);
        res.status(500).send("Error performing data quality operation");
    }
});

// New server port: 5001
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
