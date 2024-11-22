import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'Notifications', timestamps: true })
export class Notification extends Document {
  @Prop({ required: true, type: Number })
  tableNumber: number; // The table associated with the notification

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  handledBy: Types.ObjectId | null; // User currently handling this table (null if unhandled)

  @Prop({ required: true, default: false })
  isNotified: boolean; // Indicates if the notification has been retrieved by the handler
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
