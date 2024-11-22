import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Notification, NotificationSchema } from './notification.schema';
import { TablesModule } from '../tables/tables.module'; // Import TablesModule

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    TablesModule, // Import TablesModule to access tables functionality
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationModule {}
