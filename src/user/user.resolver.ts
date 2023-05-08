import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly usersService: UserService) {}

  @Mutation(() => User)
  async createUser(
    @Args('createUserData') createUserData: CreateUserDto,
  ): Promise<User> {
    return await this.usersService.create(createUserData);
  }
}
