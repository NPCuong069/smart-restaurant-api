import { IsOptional, IsArray, IsString, IsBoolean } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateOrderDto {
  @IsOptional()
  @IsArray()
  items?: { menuItem: Types.ObjectId; quantity: number; price: number }[];

  @IsOptional()
  @IsString()
  status?: string; // Possible values: "serving", "served", etc.

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;
}
