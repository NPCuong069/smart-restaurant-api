import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './order.schema';
import { TablesModule } from '../tables/tables.module'; // Import TablesModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    TablesModule, // Add TablesModule here
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
