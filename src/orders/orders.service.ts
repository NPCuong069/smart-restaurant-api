import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './order.schema';
import { UpdateOrderDto } from './dto/update-order.dto';
import { TablesService } from '../tables/tables.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly tablesService: TablesService,
  ) {}

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const newOrder = await new this.orderModel(orderData).save();

    await this.tablesService.updateTableStatusAndHandler(
      orderData.tableNumber,
      orderData.handledBy,
    );

    return newOrder;
  }

  async getLatestUnpaidOrderByTableNumber(
    tableNumber: number,
  ): Promise<Order | null> {
    const order = await this.orderModel
      .findOne({ tableNumber })
      .sort({ createdAt: -1 })
      .exec();

    if (order && !order.isPaid) {
      return order;
    }

    return null;
  }

  async updateOrder(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    // Fetch the current order
    const order = await this.orderModel.findById(orderId).exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // Update the fields based on the provided DTO
    if (updateOrderDto.items) {
      order.items = updateOrderDto.items;

      // Recalculate totalPrice based on the updated items
      order.totalPrice = order.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
    }

    if (updateOrderDto.status !== undefined) {
      order.status = updateOrderDto.status;
    }

    if (updateOrderDto.isPaid !== undefined) {
      order.isPaid = updateOrderDto.isPaid;
    }

    // Save the updated order
    return order.save();
  }
}
