import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { Users } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    private jwt: JwtService,
  ) {}

  async signup(user: Users): Promise<any> {
    if (user?.username && user?.password && user?.role) {
      const foundOne = await this.userRepository.find({
        where: { username: user.username },
      });
      console.log(foundOne);
      // checks if user exist
      if (foundOne !== []) throw new ConflictException('Email is already taken');

      const salt = await bcrypt.genSalt();
      const saltedPassword = await bcrypt.hash(user.password, salt);

      // creates new user
      const newUser = {
        username: user.username,
        password: saltedPassword,
        role: user.role,
      };
      return await this.userRepository.save(user);;
    }
    throw new BadRequestException();
  }

  async validateUser(username: string, password: string): Promise<any> {
    const foundUser = await this.userRepository.findOne({ username });
    if (foundUser) {
      if (await bcrypt.compare(password, foundUser.password)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = foundUser;
        return result;
      }
      return null;
    }
    return null;
  }
  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };

    return {
      username: user.username,
      role: user.role,
      access_token: this.jwt.sign(payload),
    };
  }
}
