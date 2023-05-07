import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly usersService: UserService) {}

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async getUserById(@Args('id') id: number): Promise<User> {
    return await this.usersService.findById(id);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async findByUsername(@Args('username') username: string): Promise<User> {
    return await this.usersService.findByUsername(username);
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserData') createUserData: CreateUserDto,
  ): Promise<User> {
    return await this.usersService.create(createUserData);
  }
}
