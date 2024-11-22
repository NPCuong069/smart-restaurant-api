import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; // Import Types from mongoose
import { Table } from './table.schema';

@Injectable()
export class TablesService {
  constructor(@InjectModel(Table.name) private tableModel: Model<Table>) {}

  // Fetch all tables
  async getAllTables(): Promise<Table[]> {
    return this.tableModel.find().exec();
  }

  // Update the status and handler for a table
  async updateTableStatusAndHandler(
    tableNumber: number,
    userId: Types.ObjectId,
  ): Promise<void> {
    const updatedTable = await this.tableModel.findOneAndUpdate(
      { tableNumber },
      { status: true, handledBy: userId },
      { new: true },
    );

    if (!updatedTable) {
      throw new NotFoundException(
        `Table with table number ${tableNumber} not found`,
      );
    }
  }

  // Fetch a table by its table number
  async getTableByNumber(tableNumber: number): Promise<Table | null> {
    return this.tableModel.findOne({ tableNumber }).exec();
  }

  // Fetch all tables handled by a specific user
  async getTablesHandledByUser(userId: Types.ObjectId): Promise<Table[]> {
    return this.tableModel.find({ handledBy: userId }).exec();
  }
}
