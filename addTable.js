// addTable.js
require('dotenv').config();
const mongoose = require('mongoose');

// Define Table Schema
const tableSchema = new mongoose.Schema(
  {
    tableNumber: { type: Number, required: true, unique: true },
    isAvailable: { type: Boolean, default: true },
    handledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Null if no employee is handling the table
    },
    currentOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
    },
  },
  {
    collection: 'Tables',
  },
);

// Create Table model
const Table = mongoose.model('Table', tableSchema);

// MongoDB connection (read from .env or use a direct connection string)
mongoose.connect(
  process.env.DATABASE_URL || 'mongodb://localhost:27017/restaurantdb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

// Function to create a new table
async function createTable(tableNumber, handledBy = null) {
  try {
    const newTable = new Table({
      tableNumber,
      isAvailable: true,
      handledBy,
    });
    await newTable.save(); // Save the table in the database
    console.log(`Table ${tableNumber} created successfully`);
  } catch (error) {
    console.error('Error creating table:', error);
  }
}

// Function to add multiple tables with optional handlers
async function addDummyTables() {
  try {
    // Example: Replace these with actual employee IDs if available
    const employeeIds = [null, "60d21b4667d0d8992e610c85", "60d21b4667d0d8992e610c86", null, "60d21b4667d0d8992e610c87"];
    
    for (let i = 0; i < employeeIds.length; i++) {
      await createTable(i + 1, employeeIds[i]);
    }
  } catch (error) {
    console.error('Error adding tables:', error);
  } finally {
    mongoose.connection.close();
  }
}

addDummyTables();
