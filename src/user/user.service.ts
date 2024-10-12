/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { logger } from '../logger'; // Import Winston logger
import { LoginDto } from '../user/dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  // Register a new user
  async register(registerDto: RegisterDto): Promise<{message:string; savedUser:User}> {
    const { username, email, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      logger.warn(`Registration attempt failed: Email already exists - ${email}`);
      throw new BadRequestException('User already exists');
    }

    // Hash password and save the new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ username, email, password: hashedPassword });
    const savedUser = await newUser.save();
  
    

    logger.info(`User registered successfully: ${email}`);
    return { message: 'User registered successfully', savedUser: savedUser };
  }

  // Login a user and return JWT token
  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });

    // Validate user credentials
    if (!user || !(await bcrypt.compare(password, user.password))) {
      logger.error(`Invalid login attempt for email: ${email}`);
      throw new BadRequestException('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, this.configService.get<string>('JWT_SECRET'), {
      expiresIn: this.configService.get<string>('JWT_EXPIRATION'),
    });

    logger.info(`User logged in successfully: ${email}`);
    return {
      message: 'User Logged In Successfully',
      token: token,
    };
  }

  // Find all users
  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    if (!users || users.length === 0) {
      throw new NotFoundException('No users found');
    }
    return users;
  }
}
