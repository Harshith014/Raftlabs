/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ItemService } from './item.service';

@Controller('items')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Post()
  create(@Body() createItemDto: any) {
    return this.itemService.create(createItemDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.itemService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: any) {
    return this.itemService.update(id, updateItemDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.itemService.delete(id);
  }
}
