import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nft } from './entities/nft.entity';
import { User } from '@app/user/entities/user.entity';
import { NftController } from './nft.controller';
import { NftService } from './nft.service';
import { ConfigModule } from '@nestjs/config';
import { NftResolver } from './nft.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    TypeOrmModule.forFeature([Nft, User]),
    ConfigModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
  ], // Import the ConfigModule here
  controllers: [NftController],
  providers: [NftService, NftResolver], // Add ConfigService to the providers array
  exports: [NftService],
})
export class NftModule {}
