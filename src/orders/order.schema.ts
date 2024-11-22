import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'Orders', timestamps: true })
export class Order extends Document {
  @Prop({
    type: [{ menuItem: Types.ObjectId, quantity: Number, price: Number }],
    required: true,
  })
  items: { menuItem: Types.ObjectId; quantity: number; price: number }[];

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ required: true })
  tableNumber: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  handledBy: Types.ObjectId;

  @Prop({ required: true, enum: ['serving', 'served'], default: 'serving' })
  status: string;

  @Prop({ required: true, default: false })
  isPaid: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
