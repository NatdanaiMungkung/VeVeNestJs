import {
  Resolver,
  Query,
  Args,
  Float,
  Context,
  Mutation,
} from '@nestjs/graphql';
import { NftService } from '@app/nft/nft.service';
import { Nft } from '@app/nft/entities/nft.entity';
import { PaginatedNftsDto, TransferNftInput } from './nft.dto';
import { PaginationDto } from '@app/dto/pagination.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@app/auth/jwt-auth.guard';
import { Roles } from '@app/decorators/roles.decorator';
import { Role } from '@app/enums/role.enum';

@Resolver(Nft)
export class NftResolver {
  constructor(private readonly nftService: NftService) {}

  @Query((returns) => PaginatedNftsDto)
  @UseGuards(JwtAuthGuard)
  async getNfts(
    @Args('pagination', { nullable: true }) paginationDto: PaginationDto,
    @Context() context,
  ): Promise<PaginatedNftsDto> {
    const userId = context.req.user.id;
    return this.nftService.getNfts(userId, paginationDto);
  }

  @Mutation((returns) => Nft)
  @UseGuards(JwtAuthGuard)
  async transferNft(
    @Args('transferNftInput') transferNftInput: TransferNftInput,
    @Context() context,
  ): Promise<Nft> {
    const userId = context.req.user.id;
    return this.nftService.transfer(
      transferNftInput.nftId,
      userId,
      transferNftInput.toUserId,
    );
  }

  @Query((returns) => [PaginatedNftsDto])
  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER)
  async getOwnedNfts(
    @Args('pagination', { nullable: true }) paginationDto: PaginationDto,
    @Context() context,
  ): Promise<PaginatedNftsDto> {
    const userId = context.req.user.id;
    return this.nftService.getNfts(userId, paginationDto);
  }
}
