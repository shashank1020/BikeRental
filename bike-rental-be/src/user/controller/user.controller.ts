import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReturnUser, UserRole } from '../entity/user.entity';
import { JwtAuthGuard } from '../jwt-auth.guard';
import UserService from '../service/user.service';
import { JoiValidationPipe } from '../../lib/helper/validation.pipe';
import {
  AddUserSchema,
  SignupUserSchema,
  UpdateUserSchema,
} from '../../lib/helper/validations';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return await this.userService.login(req.user);
  }

  @Post('signup')
  @UsePipes(new JoiValidationPipe(SignupUserSchema))
  async signup(@Body() body): Promise<ReturnUser> {
    return await this.userService.addUser(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add')
  @UsePipes(new JoiValidationPipe(AddUserSchema))
  async addNewUser(@Body() body, @Request() req): Promise<ReturnUser> {
    if (req?.user?.role !== UserRole.MANAGER) throw new UnauthorizedException();
    return await this.userService.addUser(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getUsers(@Query('page') page = '1', @Request() req) {
    if (req?.user?.role !== UserRole.MANAGER) throw new UnauthorizedException();
    return await this.userService.getUsers(page);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  updateUser(
    @Body() body,
    @Param('id') id: string,
    @Request() req,
  ): Promise<ReturnUser> {
    if (req?.user?.role !== UserRole.MANAGER) throw new UnauthorizedException();
    const { error } = UpdateUserSchema.validate(body);
    if (error)
      throw new BadRequestException(
        'Validation failed',
        error?.details?.[0].message,
      );
    return this.userService.updateUser(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  deleteUser(@Param('id') id: string, @Request() req) {
    if (req?.user?.role !== UserRole.MANAGER) throw new UnauthorizedException();
    return this.userService.deleteUser(id);
  }
}
