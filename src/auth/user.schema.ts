import { Schema, Document } from 'mongoose';

export interface User extends Document {
  username: string;
  password: string;
  role: 'manager' | 'waiter';
}

export const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    role: { type: String, enum: ['manager', 'waiter'], required: true },
  },
  {
    collection: 'Users',
  },
);
