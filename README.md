Google Sheets Clone

Overview

This project is a web-based application that mimics the core functionalities of Google Sheets. It features a spreadsheet interface for data entry, supports mathematical and data quality operations, and includes data validation mechanisms. The application is built using the MERN stack (MongoDB, Express.js, React, Node.js) with Handsontable.js for the frontend spreadsheet UI.

Features

Spreadsheet Interface

Mimics Google Sheets UI:

Toolbar for operations and formula input.

Spreadsheet-like grid with row and column headers.

Real-Time Updates:

Cell data changes are reflected dynamically.

Backend synchronization for persistent data storage.

Mathematical Functions

Supported functions:

SUM: Calculates the sum of a range of cells.

AVERAGE: Calculates the average of a range of cells.

MAX: Finds the maximum value in a range.

MIN: Finds the minimum value in a range.

COUNT: Counts the number of numeric entries in a range.

Data Quality Functions

TRIM: Removes leading and trailing whitespace.

UPPER: Converts text to uppercase.

LOWER: Converts text to lowercase.

REMOVE_DUPLICATES: Removes duplicate entries from the spreadsheet.

FIND_AND_REPLACE: Finds and replaces specific text in cells.

Data Entry and Validation

Accepts various data types: Numbers, Text, and Dates.

Ensures numeric cells only accept valid numbers.

Displays errors for invalid inputs.

Testing Interface

Allows users to test functions with custom data and ranges.

Displays results of function execution clearly.

Provides error messages for invalid ranges or unsupported operations.

Tech Stack

Frontend:

React.js

Handsontable.js for spreadsheet functionality.

Backend:

Node.js with Express.js.

MongoDB for data persistence.

Styling:

Basic CSS for layout and styling.

Installation and Setup

Prerequisites

Node.js: Install from Node.js.

MongoDB: Install and start MongoDB locally or use a cloud service.

Git: Install from Git.

Steps

Clone the Repository:

git clone <repository-link>
cd <repository-folder>

Install Backend Dependencies:

npm install

Start MongoDB:

Ensure MongoDB is running on localhost:27017.

Run the Backend Server:

node server.js

Install Frontend Dependencies:

cd client
npm install

Start the Frontend Server:

npm start

Access the Application:

Open http://localhost:3000 in your browser.

API Endpoints

Mathematical Operations

POST /api/calculate

Body:

{
  "operation": "SUM",
  "range": [[0,0],[0,1]]
}

Data Quality Operations

POST /api/data-quality

Body:

{
  "operation": "TRIM"
}

Cell Management

GET /api/cells: Fetches all cells.

POST /api/cells: Adds or updates a cell.

Future Enhancements

Advanced Formulas: Support for complex formulas like =IF, =VLOOKUP.

Graphical Visualizations: Adding charts and graphs.

User Authentication: Role-based access control.

License

This project is open-source and available under the MIT License.

Contact

For issues or contributions, feel free to reach out:

Email: adityasrivastava1702@gmail.com

GitHub: https://github.com/itz-mr-srivastava

