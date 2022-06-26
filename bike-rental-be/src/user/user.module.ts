import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import UserService from './service/user.service';
import UsersEntity from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  controllers: [UserController],
  providers: [UserService, UsersEntity],
})
export class UserModule {}
