import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '@app/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '24h' },
    }),
    ConfigModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ConfigService, AuthResolver],
})
export class AuthModule {}
