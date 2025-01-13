Google Sheets Clone

This project is a simple implementation of a Google Sheets-like application built with a MERN (MongoDB, Express, React, Node.js) stack. It allows users to perform basic spreadsheet operations such as data input, mathematical calculations, and data quality operations. The backend handles data storage and operations while the frontend provides an interactive user interface.

Features

Spreadsheet Operations:

Add, edit, and delete cell values.

Perform mathematical operations like SUM, AVERAGE, MAX, MIN, and COUNT.

Handle data quality operations like TRIM, UPPERCASE, LOWERCASE, and REMOVE_DUPLICATES.

Technologies Used:

Frontend: React, Handsontable.

Backend: Express.js, Node.js.

Database: MongoDB.

Prerequisites

Node.js (v14 or later)

MongoDB (installed and running locally or via a cloud service)

Getting Started

1. Clone the Repository
git clone https://github.com/yourusername/google-sheets-clone.git
cd google-sheets-clone

2. Install Dependencies

Backend:

cd backend
npm install

Frontend:
cd ../frontend
npm install

3. Start MongoDB

Ensure MongoDB is running locally on port 27017 or update the connection string in the backend code if using a different setup.

4. Start the Application

Backend:
cd backend
npm start
The backend server will start at http://localhost:5000.

Frontend:
cd ../frontend
npm start
The frontend server will start at http://localhost:3000.

Sample Data

To populate the database with sample data, run the following MongoDB commands:
use google-sheets-clone

db.cells.insertMany([
  { row: 0, column: 0, value: "10" },
  { row: 0, column: 1, value: "20" },
  { row: 0, column: 2, value: "30" },
  { row: 1, column: 0, value: "40" },
  { row: 1, column: 1, value: "50" },
  { row: 1, column: 2, value: "60" },
  { row: 2, column: 0, value: "Apple" },
  { row: 2, column: 1, value: "Banana" },
  { row: 2, column: 2, value: "Cherry" },
  { row: 3, column: 0, value: "90" },
  { row: 3, column: 1, value: "100" },
  { row: 3, column: 2, value: "110" },
  { row: 4, column: 0, value: "200" },
  { row: 4, column: 1, value: "300" },
  { row: 4, column: 2, value: "400" }
]);

Usage Instructions

Mathematical Operations

Enter the operation (e.g., SUM, AVERAGE, MAX, MIN, or COUNT) in the provided input box.

Specify the range of cells in the format [[row1, col1], [row2, col2]].

Click "Calculate" to get the result.

Data Quality Operations

Click the appropriate button for the operation you want to perform:

Trim Whitespace: Removes leading and trailing spaces from all cell values.

Uppercase: Converts all cell values to uppercase.

Lowercase: Converts all cell values to lowercase.

Remove Duplicates: Removes duplicate cell entries.

File Structure

Backend (/backend):

server.js: Entry point for the backend server.

models/Cell.js: Mongoose schema for cell data.

routes/: Contains API routes.

Frontend (/frontend):

src/App.js: Main React component.

src/components/: Contains reusable components.

src/styles/: CSS and styling files.

License

This project is licensed under the MIT License. Feel free to use, modify, and distribute it as needed.

Contribution

Contributions are welcome! Feel free to fork the repository and submit a pull request.

Contact

For any queries or feedback, reach out to adityasrivastava1702@gmail.com.


