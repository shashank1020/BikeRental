import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { UserController } from './controller/user.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../lib/constants/constants';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import UsersEntity from './entity/user.entity';
import UserService from './service/user.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
    TypeOrmModule.forFeature([UsersEntity]),
  ],
  providers: [AuthService, UserService, LocalStrategy, JwtStrategy],
  controllers: [UserController],
})
export class AuthModule {}
