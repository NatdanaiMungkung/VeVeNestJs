import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Request,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { NftService } from './nft.service';
import { PaginationDto } from '@app/dto/pagination.dto';
import { CreateNftDto, PaginatedNftsDto } from './nft.dto';
import { User } from '@app/user/entities/user.entity';

@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  async create(@Body() createNftDto: CreateNftDto): Promise<void> {
    await this.nftService.create(createNftDto);
  }

  @Post('transfer')
  @UseGuards(JwtAuthGuard)
  async transfer(
    @Request() req: { user: User },
    @Body() { id, toUserId }: { id: number; toUserId: number },
  ): Promise<void> {
    await this.nftService.transfer(id, req.user.id, toUserId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getNfts(
    @Request() req: { user: User },
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedNftsDto> {
    const userId = req.user.id;
    const { items, total } = await this.nftService.getNfts(
      userId,
      paginationDto,
    );
    const { page, limit } = paginationDto;
    return {
      items: items.map(
        ({ name, blockchainLink, description, imageUrl, mintDate }) => ({
          name,
          blockchainLink,
          description,
          imageUrl,
          mintDate,
        }),
      ),
      page,
      limit,
      total,
    };
  }
}
