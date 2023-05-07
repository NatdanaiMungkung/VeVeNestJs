import { Nft } from '@app/nft/entities/nft.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let usersService: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Nft],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UserService],
    }).compile();

    usersService = module.get<UserService>(UserService);
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500)); // workaround for sqlite memory leak
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const user = await usersService.create({
        username: 'test_create',
        password: 'password',
        role: 'test',
      });
      expect(user.username).toBe('test_create');
      expect(user.password).not.toBe('password');
    });

    it('should throw an error if username is taken', async () => {
      await usersService.create({
        username: 'test_error',
        password: 'password',
        role: 'test',
      });
      await expect(
        usersService.create({
          username: 'test_error',
          password: 'password',
          role: 'test',
        }),
      ).rejects.toThrow();
    });
  });

  describe('findOneByUsername', () => {
    it('should return the user with the given username', async () => {
      await usersService.create({
        username: 'test_findByUsername',
        password: 'password',
        role: 'test',
      });
      const user = await usersService.findByUsername('test_findByUsername');
      expect(user).toBeDefined();
      expect(user.username).toBe('test_findByUsername');
    });

    it('should return null if user does not exist', async () => {
      const user = await usersService.findByUsername('nonexistent');
      expect(user).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return the user with the given ID', async () => {
      const user = await usersService.create({
        username: 'test_findById',
        password: 'password',
        role: 'test',
      });
      const foundUser = await usersService.findById(user.id);
      expect(foundUser).toBeDefined();
      expect(foundUser.id).toBe(user.id);
    });

    it('should return null if user does not exist', async () => {
      const foundUser = await usersService.findById(999);
      expect(foundUser).toBeNull();
    });
  });
});
