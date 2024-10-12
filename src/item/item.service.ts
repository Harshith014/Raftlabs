/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item, ItemDocument } from '../item/schemas/item.schema';
import { logger } from '../logger'; // Import the Winston logger

@Injectable()
export class ItemService {
  constructor(@InjectModel(Item.name) private itemModel: Model<ItemDocument>) {}

  // Create a new item
  async create(
    createItemDto: any,
  ): Promise<{ message: string; createdItem: Item }> {
    try {
      const createdItem = new this.itemModel(createItemDto);
      await createdItem.save();
      logger.info(`Item created successfully: ${createdItem._id}`);
      return { message: 'Item Created Successfully', createdItem: createdItem };
    } catch (error) {
      logger.error(`Error creating item: ${error.message}`);
      throw new BadRequestException('Failed to create item');
    }
  }

  // Find all items with pagination, sorting, and search
  async findAll(query: any): Promise<Item[]> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'name',
        order = 'asc',
        search = '',
      } = query;

      // Ensure the `sortBy` value is either 'name' or 'description', default to 'name' if invalid
      const validSortFields = ['name', 'description'];
      const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
      const skip = (page - 1) * limit;

      // Building the search query to match in both name and description
      const searchQuery = search
        ? {
            $or: [
              { name: new RegExp(search, 'i') }, // Search in 'name' (case-insensitive)
              { description: new RegExp(search, 'i') }, // Search in 'description' (case-insensitive)
            ],
          }
        : {};

      const items = await this.itemModel
        .find(searchQuery) // Apply the search query
        .sort({ [sortField]: order === 'asc' ? 1 : -1 }) // Sorting by either 'name' or 'description'
        .skip(skip)
        .limit(Number(limit))
        .exec();

      logger.info(`Fetched ${items.length} items`);
      return items;
    } catch (error) {
      logger.error(`Error fetching items: ${error.message}`);
      throw new NotFoundException('Items not found');
    }
  }

  // Find one item by ID
  async findOne(id: string): Promise<Item> {
    try {
      const item = await this.itemModel.findById(id).exec();
      if (!item) {
        logger.warn(`Item with ID ${id} not found`);
        throw new NotFoundException('Item not found');
      }
      logger.info(`Fetched item with ID: ${id}`);
      return item;
    } catch (error) {
      logger.error(`Error fetching item with ID ${id}: ${error.message}`);
      throw new NotFoundException('Item not found');
    }
  }

  // Update an item by ID
  async update(
    id: string,
    updateItemDto: any,
  ): Promise<{ message: string; updatedItem: Item }> {
    try {
      const updatedItem = await this.itemModel
        .findByIdAndUpdate(id, updateItemDto, { new: true })
        .exec();
      if (!updatedItem) {
        logger.warn(`Item with ID ${id} not found for update`);
        throw new NotFoundException('Item not found');
      }
      logger.info(`Item with ID ${id} updated successfully`);
      return { message: 'Item updated Successfully', updatedItem: updatedItem };
    } catch (error) {
      logger.error(`Error updating item with ID ${id}: ${error.message}`);
      throw new BadRequestException('Failed to update item');
    }
  }

  async delete(id: string): Promise<{ message: string; deletedItem: Item }> {
    try {
      const deletedItem = await this.itemModel.findByIdAndDelete(id).exec();
      if (!deletedItem) {
        logger.warn(`Item with ID ${id} not found for deletion`);
        throw new NotFoundException('Item not found');
      }
      logger.info(`Item with ID ${id} deleted successfully`);
      return { message: 'Item Deleted Successfully', deletedItem: deletedItem };
    } catch (error) {
      logger.error(`Error deleting item with ID ${id}: ${error.message}`);
      throw new BadRequestException('Failed to delete item');
    }
  }
}
