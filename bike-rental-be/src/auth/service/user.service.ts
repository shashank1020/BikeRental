import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import UsersEntity, { UserRole } from '../entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { PageSize } from '../../lib/constants/constants';
import { use } from 'passport';
@Injectable()
export default class UserService {
  constructor(private jwt: JwtService) {}

  async login(user: UsersEntity) {
    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      email: user.email,
      role: user.role,
      access_token: this.jwt.sign(payload),
    };
  }
  async signup(user: UsersEntity): Promise<any> {
    const foundOne = await UsersEntity.findOne({
      where: { email: user.email.toLowerCase() },
    });
    // checks if user exist
    if (foundOne) throw new ConflictException('Email is already taken');

    const salt = await bcrypt.genSalt();
    const saltedPassword = await bcrypt.hash(user.password, salt);

    // creates new user
    const newUser = new UsersEntity();
    newUser.email = user.email.toLowerCase();
    newUser.password = saltedPassword;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = await UsersEntity.save(newUser);
    return result;
  }

  async getUsers(reqPage: string) {
    const page = Math.max(Number(reqPage) || 1, 1);
    const users = await UsersEntity.find({
      take: PageSize,
      skip: (page - 1) * PageSize,
    });

    const userCount = await UsersEntity.count({});
    const pageCount = Math.ceil(userCount / PageSize);
    return { users, page, pageCount };
  }

  async updateUser(id: string, { email, role }, authUser: UsersEntity) {
    const existingUser = await UsersEntity.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser && existingUser.id !== parseInt(id))
      throw new BadRequestException('Someone else has this email');
    const user = await UsersEntity.findOne(id);
    if (user) {
      user.email = email.toLowerCase();
      user.role = role;
      await user.save();
      return user;
    } else throw new NotFoundException();
  }

  async deleteUser(id: string) {
    const foundOne = await UsersEntity.findOne(id);
    if (foundOne) {
      await UsersEntity.delete(id);
      return {};
    } else throw new NotFoundException();
  }
}
