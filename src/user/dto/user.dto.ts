import { Field, InputType } from '@nestjs/graphql';
import { IsString, MinLength, MaxLength } from 'class-validator';

@InputType()
export class CreateUserDto {
  @IsString()
  @Field(() => String)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Field(() => String)
  password: string;

  @IsString()
  role: string;
}
