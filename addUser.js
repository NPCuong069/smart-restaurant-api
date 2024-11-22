require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define User Schema
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed password
    role: { type: String, enum: ['manager', 'waiter'], required: true },
  },
  {
    collection: 'Users', // Explicitly specify the collection name as 'Users'
  },
);

// Create User model
const User = mongoose.model('User', userSchema);

// MongoDB connection (read from .env or use a direct connection string)
mongoose.connect(
  process.env.DATABASE_URL || 'mongodb://localhost:27017/restaurantdb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

// Function to create a new user
async function createUser(username, password, role) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
    });
    await newUser.save(); // Save the user in the database
    console.log(`User ${username} created successfully`);
  } catch (error) {
    console.error(`Error creating user ${username}:`, error);
  }
}

// Array of employee usernames with dummy names
const employees = [
  { username: 'john_doe', role: 'waiter' },
  { username: 'jane_smith', role: 'waiter' },
  { username: 'mike_jones', role: 'waiter' },
  { username: 'emily_davis', role: 'waiter' },
  { username: 'sarah_miller', role: 'waiter' },
  { username: 'chris_wilson', role: 'waiter' },
  { username: 'kate_taylor', role: 'waiter' },
  { username: 'james_brown', role: 'waiter' },
  { username: 'linda_clark', role: 'waiter' },
  { username: 'robert_lewis', role: 'waiter' },
  { username: 'patricia_white', role: 'waiter' },
  { username: 'david_harris', role: 'waiter' }
];

// Function to add multiple employees
async function addEmployees() {
  for (let employee of employees) {
    const password = `${employee.username}@123`; // Set password as "username@123"
    await createUser(employee.username, password, employee.role);
  }
  mongoose.connection.close();
}

// Run the addEmployees function
addEmployees();
