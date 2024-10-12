/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemController } from './item.controller';
import { ItemResolver } from './item.resolver';
import { ItemService } from './item.service';
import { Item, ItemSchema } from './schemas/item.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }])],
  providers: [ItemService, ItemResolver],
  controllers: [ItemController],
})
export class ItemModule {}
