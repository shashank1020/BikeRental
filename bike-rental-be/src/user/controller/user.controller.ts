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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import UsersEntity from '../entity/user.entity';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import UserService from '../service/user.service';
import { JoiValidationPipe } from '../../lib/helper/validation.pipe';
import { UpdateUserSchema } from '../../lib/helper/validations';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('signup')
  async signup(@Body() user: UsersEntity): Promise<any> {
    return await this.userService.signup(user);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return await this.userService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  getUsers(@Query('page') page = '1') {
    return this.userService.getUsers(page);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiValidationPipe(UpdateUserSchema))
  @Put('/:id')
  updateUser(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    const { email, role } = body;
    return this.userService.updateUser(id, {
      email,
      role,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  deleteUser(@Param('id') id: string, @Request() req) {
    return this.userService.deleteUser(id, req.user);
  }
}
