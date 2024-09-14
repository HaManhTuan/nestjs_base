import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './../../../typeorm/entities/User';
import { CreateUserParams } from '@/utils/types';
import { UpdateUserDto } from '@/users/dtos/UpdateUser.dto';
import { ApiResponse } from '@/common/response-wrapper';
import { LoggingService } from '@/common/logging.service';

@Injectable()
export class UsersService {
  saltRounds = 10;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly loggingService: LoggingService,
  ) {}

  findUsers() {
    return this.userRepository.find();
  }

  async createUser(createUserDetail: CreateUserParams) {
    try {
      if (createUserDetail.password) {
        createUserDetail.password = await this.hashPassword(
          createUserDetail.password,
        );
      }

      const newUser = this.userRepository.create({
        ...createUserDetail,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const savedUser = await this.userRepository.save(newUser);
      this.loggingService.info('Created user', savedUser);
      return new ApiResponse(true, savedUser);
    } catch (error) {
      console.error('Error creating user:', error);
      // return new ApiResponse(false, null);
      console.error('Error creating user:', error);
      this.loggingService.error('Error creating user', error.stack);
      throw new BadRequestException('Failed to create user');
    }
  }

  async updateUser(id: number, updateUserDetail: UpdateUserDto) {
    try {
      if (updateUserDetail.password) {
        updateUserDetail.password = await this.hashPassword(
          updateUserDetail.password,
        );
      }

      const updatedUser = await this.userRepository.update(
        { id },
        {
          ...updateUserDetail,
          updatedAt: new Date(), // Update the timestamp
        },
      );
      return new ApiResponse(true, updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      this.loggingService.error('Error updating user', error.stack);
      throw new BadRequestException('Failed to update user');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }
}
