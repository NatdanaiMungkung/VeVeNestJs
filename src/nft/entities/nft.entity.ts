import { User } from '@app/user/entities/user.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
@ObjectType()
export class Nft {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column({ unique: true })
  @Field()
  name: string;

  @Column({ unique: true })
  @Field()
  blockchainLink: string;

  @Column()
  @Field()
  description: string;

  @Column()
  @Field()
  imageUrl: string;

  @Column()
  @Field()
  mintDate: Date;

  @Column()
  ownerId: number;
}
