import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../dto/pagination.dto';
import { User } from '@app/user/entities/user.entity';
import { CreateNftDto, PaginatedNftsDto } from './nft.dto';
import { Nft } from './entities/nft.entity';

@Injectable()
export class NftService {
  constructor(
    @InjectRepository(Nft) private readonly nftRepository: Repository<Nft>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createNftDto: CreateNftDto): Promise<Nft> {
    const nft = new Nft();
    const user = await this.userRepository.findOne({
      where: { id: createNftDto.ownerId },
    });
    if (user) {
      nft.name = createNftDto.name;
      nft.blockchainLink = createNftDto.blockchainLink;
      nft.description = createNftDto.description;
      nft.imageUrl = createNftDto.imageUrl;
      nft.mintDate = createNftDto.mintDate;
      nft.ownerId = user.id;
    } else {
      throw new ForbiddenException(
        `Invalid owner ID ${createNftDto.ownerId} provided`,
      );
    }

    return this.nftRepository.save(nft);
  }

  async transfer(
    nftId: number,
    fromUserId: number,
    toUserId: number,
  ): Promise<Nft> {
    const nft = await this.nftRepository.findOne({
      where: {
        id: nftId,
      },
    });
    if (!nft) {
      throw new NotFoundException(`NFT with ID ${nftId} not found`);
    }
    if (nft.ownerId !== fromUserId) {
      throw new ForbiddenException(
        `NFT with ID ${nftId} is not owned by user with ID ${fromUserId}`,
      );
    }
    const toUser = await this.userRepository.findOne({
      where: {
        id: toUserId,
      },
    });
    if (!toUser) {
      throw new NotFoundException(`User with ID ${toUserId} not found`);
    }
    nft.ownerId = toUser.id;
    return await this.nftRepository.save(nft);
  }

  async getNfts(
    userId: number,
    paginationDto: PaginationDto,
  ): Promise<PaginatedNftsDto> {
    const { page, limit } = paginationDto;
    const [items, total] = await this.nftRepository.findAndCount({
      where: { ownerId: userId },
      take: limit,
      skip: (page - 1) * limit,
    });
    return { items, total, page, limit };
  }
}
