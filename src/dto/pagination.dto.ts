import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

@InputType()
export class PaginationDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @Field(() => Int, { defaultValue: 1 })
  page: number;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  @Field(() => Int, { defaultValue: 10 })
  limit: number;
}
