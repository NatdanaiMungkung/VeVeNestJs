import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '@app/auth/auth.service';
import { UserService } from '@app/user/user.service';
import { User } from '@app/user/entities/user.entity';
import { Nft } from '@app/nft/entities/nft.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

describe('AuthService', () => {
  let authService: AuthService;
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
      providers: [AuthService, UserService, JwtService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UserService>(UserService);
    await usersService.create({
      username: 'test',
      password: 'password',
      role: 'admin',
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500)); // workaround for sqlite memory leak
  });

  describe('validateUser', () => {
    it('should return the user object if credentials are valid', async () => {
      const user = await authService.validateUser('test', 'password');
      expect(user).toMatchObject({
        username: 'test',
      });
    });

    it('should return null if credentials are invalid', async () => {
      const user = await authService.validateUser('test', 'wrongpassword');
      expect(user).toBeNull();
    });
  });

  describe('login', () => {
    it('should return a JWT token if credentials are valid', async () => {
      const user = await authService.validateUser('test', 'password');
      const token = await authService.login(user);
      expect(token).toBeDefined();
    });
  });
});
