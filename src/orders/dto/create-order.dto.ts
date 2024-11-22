import {
  IsArray,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Types } from 'mongoose';

class OrderItemDto {
  @IsNotEmpty()
  menuItem: Types.ObjectId;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;
}

export class CreateOrderDto {
  @IsArray()
  items: OrderItemDto[];

  @IsNumber()
  tableNumber: number;

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;
}
