import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    if (user?.email && user?.password && user?.role) {
      const foundOne = await this.userRepository.find({
        where: { email: user.email },
      });
      console.log(foundOne);
      // checks if user exist
      if (foundOne.length > 0)
        throw new ConflictException('Email is already taken');

      const salt = await bcrypt.genSalt();
      const saltedPassword = await bcrypt.hash(user.password, salt);

      // creates new user
      const newUser = {
        email: user.email,
        password: saltedPassword,
        role: user.role,
      };
      return await this.userRepository.save(newUser);
    }
    throw new BadRequestException();
  }

  async validateUser(email: string, password: string): Promise<any> {
    const foundUser = await this.userRepository.findOne({
      where: { email },
    });
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
    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      email: user.email,
      role: user.role,
      access_token: this.jwt.sign(payload),
    };
  }
}
