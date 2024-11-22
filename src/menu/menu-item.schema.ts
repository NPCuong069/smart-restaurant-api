import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'Menu_Items', timestamps: true })
export class MenuItem extends Document {
  @Prop({ required: true })
  itemName: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  category: string;

  @Prop({ required: true, default: true })
  availability: boolean;

  @Prop()
  imageUrl: string;

  // Add a vector field for embeddings
  @Prop({ type: [Number], default: [] }) // Array of numbers to store vector embeddings
  vector: number[];
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
