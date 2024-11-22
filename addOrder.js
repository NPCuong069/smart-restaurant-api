require('dotenv').config();
const mongoose = require('mongoose');

// Define Order Schema with Timestamps
const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        itemName: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    tableNumber: { type: Number, required: true },
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
    collection: 'Orders',
  }
);

// Create Order model
const Order = mongoose.model('Order', orderSchema);

// MongoDB connection (read from .env or use a direct connection string)
mongoose.connect(
  process.env.DATABASE_URL || 'mongodb://localhost:27017/restaurantdb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Function to create a new order
async function createOrder(items, totalPrice, tableNumber, handledBy) {
  try {
    const newOrder = new Order({
      items,
      totalPrice,
      tableNumber,
      handledBy,
    });
    await newOrder.save(); // Save the order in the database
    console.log(`Order for table ${tableNumber} created successfully with createdAt: ${newOrder.createdAt}`);
  } catch (error) {
    console.error('Error creating order:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Example data for the order
const items = [
  { itemName: 'Burger', quantity: 2, price: 5.99 },
  { itemName: 'Fries', quantity: 1, price: 2.99 },
];
const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
const tableNumber = 4; // Example table number
const handledBy = "6728c37c8d517cfaa525f508"; // Replace with an actual User ID from your database

// Run the function to add a single order
createOrder(items, totalPrice, tableNumber, handledBy);
