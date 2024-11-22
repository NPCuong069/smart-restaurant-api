import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from './notification.schema';
import { TablesService } from '../tables/tables.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
    private readonly tablesService: TablesService,
  ) {}

  // Create a new notification
  async createNotification(tableNumber: number): Promise<Notification> {
    // Check if the table is currently assigned to a handler
    const table = await this.tablesService.getTableByNumber(tableNumber);

    if (!table || !table.handledBy) {
      throw new NotFoundException(
        'Table is not currently assigned to any user.',
      );
    }

    // Create and save the notification
    const notification = new this.notificationModel({
      tableNumber,
      handledBy: new Types.ObjectId(table.handledBy),
    });

    return notification.save();
  }

  // Get notifications for the user currently handling tables
  async getNotificationsForHandler(userId: string): Promise<Notification[]> {
    // Convert the string userId into an ObjectId
    const objectId = new Types.ObjectId(userId);
    console.log(objectId);
    // Find all tables the user is handling
    const tables = await this.tablesService.getTablesHandledByUser(objectId);

    if (!tables.length) {
      throw new NotFoundException('You are not currently handling any tables.');
    }

    // Extract table numbers
    const tableNumbers = tables.map((table) => table.tableNumber);

    // Fetch unresolved notifications for those tables
    const notifications = await this.notificationModel.find({
      tableNumber: { $in: tableNumbers },
      isNotified: false,
    });

    // Mark these notifications as notified
    await this.notificationModel.updateMany(
      { _id: { $in: notifications.map((n) => n._id) } },
      { $set: { isNotified: true } },
    );

    return notifications;
  }
}
