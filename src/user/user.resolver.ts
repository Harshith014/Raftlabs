/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoginResponse } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // Query to get all users (example)
  @Query((returns) => [User])
  async users() {
    return this.userService.findAll(); // Implement this in your service
  }

  // Mutation to register a new user
  @Mutation((returns) => User)
  async register(@Args('registerDto') registerDto: RegisterDto) {
    const { savedUser } = await this.userService.register(registerDto);
    return savedUser; // Return the entire savedUser  object
  }

  // Mutation for login (returns token as a string)
  // Mutation for login (returns token and message)
  @Mutation((returns) => LoginResponse)
  async login(@Args('loginDto') loginDto: LoginDto) {
    const { token, message } = await this.userService.login(loginDto);
    return { token, message }; // Return the token and message
  }
}
