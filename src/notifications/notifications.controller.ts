import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBody, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notification for a table' })
  @ApiBody({
    description: 'Table number for which to create a notification',
    schema: {
      type: 'object',
      properties: {
        tableNumber: {
          type: 'number',
          example: 1,
          description: 'Table number for which the notification is created',
        },
      },
    },
  })
  async createNotification(@Body() body: { tableNumber: number }) {
    return this.notificationsService.createNotification(body.tableNumber);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Get notifications for the currently handled tables',
  })
  @ApiBearerAuth()
  async getNotificationsForHandler(@Request() req: any) {
    return this.notificationsService.getNotificationsForHandler(
      req.user.userId,
    );
  }
}
