import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, MinLength, MaxLength } from 'class-validator';

@InputType()
export class LoginDto {
  @IsString()
  @Field(() => String)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Field(() => String)
  password: string;
}

@ObjectType()
export class LoginResponse {
  @Field()
  access_token: string;
}

export class RegisterDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsString()
  role: string;
}
