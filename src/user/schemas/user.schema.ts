import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@ObjectType() // GraphQL object type decorator
@Schema() // Mongoose schema decorator
export class User {
  @Field(() => ID, { nullable: false }) // GraphQL ID field
  _id: string; // MongoDB automatically generates this field

  @Field() // GraphQL field
  @Prop({ required: true }) // Mongoose schema prop
  username: string;

  @Field() // GraphQL field
  @Prop({ required: true }) // Mongoose schema prop
  email: string;

  @Prop({ required: true })
  password: string; // Do NOT expose password via GraphQL
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
