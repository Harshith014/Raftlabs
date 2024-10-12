// item.resolver.ts
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateItemDto } from './dto/create.dto';
import { UpdateItemDto } from './dto/update.dto';
import { ItemService } from './item.service';
import { Item } from './schemas/item.schema';

@Resolver(() => Item)
export class ItemResolver {
  constructor(private readonly itemService: ItemService) {}

  @Mutation(() => Item)
  async createItem(@Args('createItemDto') createItemDto: CreateItemDto) {
    const result = await this.itemService.create(createItemDto);
    return result.createdItem;
  }

  @Query(() => [Item])
  async findAllItems(
    @Args('page', { nullable: true }) page: number = 1,
    @Args('limit', { nullable: true }) limit: number = 10,
    @Args('sortBy', { nullable: true }) sortBy: string = 'name',
    @Args('order', { nullable: true }) order: string = 'asc',
    @Args('search', { nullable: true }) search: string = '',
  ) {
    return this.itemService.findAll({ page, limit, sortBy, order, search });
  }

  @Query(() => Item)
  async findItemById(@Args('id') id: string) {
    return this.itemService.findOne(id);
  }

  @Mutation(() => Item)
  async updateItem(
    @Args('id') id: string,
    @Args('updateItemDto') updateItemDto: UpdateItemDto,
  ) {
    const result = await this.itemService.update(id, updateItemDto);
    return result.updatedItem;
  }

  @Mutation(() => Item)
  async deleteItem(@Args('id') id: string) {
    const result = await this.itemService.delete(id);
    return result.deletedItem;
  }
}
