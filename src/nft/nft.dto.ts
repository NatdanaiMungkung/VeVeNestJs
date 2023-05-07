import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsString, IsUrl, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateNftDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsUrl()
  blockchainLink: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;

  @IsNotEmpty()
  mintDate: Date;

  @IsNotEmpty()
  @IsNumber()
  ownerId: number;
}

@ObjectType()
export class NftWithoutOwnerDto {
  @Field()
  name: string;

  @Field()
  blockchainLink: string;

  @Field()
  description: string;

  @Field()
  imageUrl: string;

  @Field()
  mintDate: Date;
}

@ObjectType()
export class PaginatedNftsDto {
  @Field(() => [NftWithoutOwnerDto])
  items: NftWithoutOwnerDto[];

  @IsNumber()
  @Min(1)
  @Field()
  page: number;

  @IsNumber()
  @Min(1)
  @Field()
  limit: number;

  @IsNumber()
  @Field()
  total: number;
}

@InputType()
export class TransferNftInput {
  @Field(() => Int)
  nftId: number;

  @Field(() => Int)
  toUserId: number;
}

@InputType()
export class CreateNftInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  blockchainLink: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  imageUrl: string;
}
