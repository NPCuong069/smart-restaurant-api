import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'Tables', timestamps: true }) // Enables createdAt and updatedAt timestamps
export class Table extends Document {
  @Prop({ required: true, unique: true })
  tableNumber: number;

  @Prop({ required: true, default: true })
  isAvailable: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  handledBy: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'Order', default: null })
  currentOrder: Types.ObjectId | null;

  @Prop({ required: true, default: true })
  status: boolean;
}

export const TableSchema = SchemaFactory.createForClass(Table);
