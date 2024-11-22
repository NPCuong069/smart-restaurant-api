import {
  Controller,
  Post,
  Get,
  Body,
  Put,
  UseGuards,
  Query,
  Request,
  Param,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { Types } from 'mongoose';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  async addOrder(@Body() createOrderDto: CreateOrderDto, @Request() req: any) {
    // Extract the user ID from the JWT payload
    const userId = req.user.userId;

    // Log userId to confirm it’s correctly retrieved
    console.log('User ID from JWT:', userId);

    if (!userId) {
      throw new Error('User ID not found in JWT token');
    }

    // Calculate the total price based on items
    const totalPrice = createOrderDto.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    // Create the new order data with handledBy set to the user ID
    const orderData = {
      ...createOrderDto,
      handledBy: new Types.ObjectId(userId),
      totalPrice,
      status: 'serving',
      isPaid: false,
    };

    return this.ordersService.createOrder(orderData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('latest-unpaid')
  @ApiOperation({ summary: 'Get the latest unpaid order by table number' })
  @ApiQuery({
    name: 'tableNumber',
    required: true,
    description: 'Table number to retrieve the latest unpaid order for',
  })
  async getLatestUnpaidOrderByTable(@Query('tableNumber') tableNumber: number) {
    // Fetch the latest unpaid order or return null if the latest order is paid
    const latestOrder =
      await this.ordersService.getLatestUnpaidOrderByTableNumber(tableNumber);
    return latestOrder;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':orderId')
  @ApiOperation({ summary: 'Update an order by its ID' })
  @ApiParam({
    name: 'orderId',
    required: true,
    description: 'Order ID to update',
  })
  async updateOrder(
    @Param('orderId') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.updateOrder(orderId, updateOrderDto);
  }
}
