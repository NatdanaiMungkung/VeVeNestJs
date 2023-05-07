import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtStrategy } from '@app/auth/strategies/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule], // Import the ConfigModule here
  controllers: [UserController],
  providers: [UserService, JwtStrategy, ConfigService], // Add ConfigService to the providers array
  exports: [UserService],
})
export class UserModule {}
