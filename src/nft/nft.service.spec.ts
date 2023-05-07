import { User } from '@app/user/entities/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nft } from './entities/nft.entity';
import { NftService } from './nft.service';
import { UserService } from '@app/user/user.service';

describe('NftsService', () => {
  let nftsService: NftService;
  let usersService: UserService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Nft, User],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Nft, User]),
      ],
      providers: [NftService, UserService],
    }).compile();
    usersService = module.get<UserService>(UserService);
    nftsService = module.get<NftService>(NftService);
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500)); // workaround for sqlite memory leak
  });

  describe('create', () => {
    it('should create a new nft', async () => {
      const user = await usersService.create({
        username: 'test_create',
        password: 'password',
        role: 'test',
      });
      const nftData = {
        name: 'Test NFT',
        blockchainLink: 'https://example.com/nft',
        description: 'This is a test NFT',
        imageUrl: 'https://example.com/nft.jpg',
        mintDate: new Date(),
        ownerId: user.id,
      };
      const nft = await nftsService.create(nftData);
      const compareNft = { ...nftData };
      delete compareNft.ownerId;
      expect(nft).toMatchObject(compareNft);
      expect(nft.id).toBeDefined();
    });
  });

  describe('transfer', () => {
    it('should transfer nft', async () => {
      const user = await usersService.create({
        username: 'test_transfer',
        password: 'password',
        role: 'test',
      });
      const user2 = await usersService.create({
        username: 'test_transfer2',
        password: 'password',
        role: 'test',
      });
      const nftData = {
        name: 'Test transfer NFT',
        blockchainLink: 'https://example.com/nft_transfer',
        description: 'This is a test NFT',
        imageUrl: 'https://example.com/nft.jpg',
        mintDate: new Date(),
        ownerId: user.id,
      };
      const nft = await nftsService.create(nftData);
      const transferredNft = await nftsService.transfer(
        nft.id,
        user.id,
        user2.id,
      );
      expect(nft).not.toMatchObject(transferredNft);
    });

    it('should throw error if not owner', async () => {
      const user = await usersService.create({
        username: 'test_error',
        password: 'password',
        role: 'test',
      });
      const nftData = {
        name: 'Test error NFT',
        blockchainLink: 'https://example.com/nft_error',
        description: 'This is a test NFT',
        imageUrl: 'https://example.com/nft.jpg',
        mintDate: new Date(),
        ownerId: user.id,
      };
      const nft = await nftsService.create(nftData);
      await expect(
        nftsService.transfer(nft.id, user.id + 9, user.id),
      ).rejects.toThrow();
    });

    it('should throw error if invalid receiver', async () => {
      const user = await usersService.create({
        username: 'test_error_receiver',
        password: 'password',
        role: 'test',
      });
      const nftData = {
        name: 'Test error Receiver NFT',
        blockchainLink: 'https://example.com/nft_error_receiver',
        description: 'This is a test NFT',
        imageUrl: 'https://example.com/nft.jpg',
        mintDate: new Date(),
        ownerId: user.id,
      };
      const nft = await nftsService.create(nftData);
      await expect(
        nftsService.transfer(nft.id, user.id, user.id + 9),
      ).rejects.toThrow();
    });
  });
});
