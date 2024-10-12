/* eslint-disable prettier/prettier */
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateItemDto {
  @Field()
  name: string;

  @Field()
  description: string;
}