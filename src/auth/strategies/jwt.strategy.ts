import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { User } from '@app/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // secretOrKey: 'JWT_SECRET',
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
  }

  async validate(payload: any): Promise<User> {
    const { sub: id } = payload;
    const user = await this.userService.findById(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
