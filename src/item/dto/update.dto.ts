/* eslint-disable prettier/prettier */
import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateItemDto } from './create.dto';

@InputType()
export class UpdateItemDto extends PartialType(CreateItemDto) {
  @Field()
  name: string;

  @Field()
  description: string;
}