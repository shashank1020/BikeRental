import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Get,
  Query,
  Put,
  Param,
  Delete,
  UsePipes,
  HttpCode,
  BadRequestException, UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import UsersEntity, {UserRole} from '../entity/user.entity';
import { JwtAuthGuard } from '../jwt-auth.guard';
import UserService from '../service/user.service';
import { JoiValidationPipe } from '../../lib/helper/validation.pipe';
import {
  SignupUserSchema,
  UpdateUserSchema,
} from '../../lib/helper/validations';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return await this.userService.login(req.user);
  }

  @Post('signup')
  @UsePipes(new JoiValidationPipe(SignupUserSchema))
  async signup(@Body() user: UsersEntity): Promise<any> {
    return await this.userService.signup(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getUsers(@Query('page') page = '1', @Request() req) {
    if (req?.user?.role !== UserRole.MANAGER) throw new UnauthorizedException();
    return await this.userService.getUsers(page);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiValidationPipe(UpdateUserSchema))
  @Put('/:id')
  updateUser(@Param('id') id: string, @Body() body, @Request() req) {
    if (req?.user?.role !== UserRole.MANAGER) throw new UnauthorizedException();
    return this.userService.updateUser(id, body, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  deleteUser(@Param('id') id: string, @Request() req) {
    if (req?.user?.role !== UserRole.MANAGER) throw new UnauthorizedException();
    return this.userService.deleteUser(id);
  }
}
