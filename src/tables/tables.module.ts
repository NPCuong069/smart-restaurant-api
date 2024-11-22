import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TablesService } from './tables.service';
import { Table, TableSchema } from './table.schema';
import { TablesController } from './tables.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Table.name, schema: TableSchema }]),
  ],
  providers: [TablesService],
  controllers: [TablesController],
  exports: [TablesService], // Export TablesService so it can be used in other modules
})
export class TablesModule {}
