import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserController } from '../user/controller/user.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../lib/constants/constants';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import UsersEntity from '../user/entity/user.entity';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
    TypeOrmModule.forFeature([UsersEntity]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [UserController],
})
export class AuthModule {}
