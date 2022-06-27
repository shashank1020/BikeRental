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
  Request,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { BikeService } from '../service/bike.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import BikeEntity from '../enitity/bike.entity';
import { UpdateResult } from 'typeorm';
import {
  BikeSchema,
  DateTimeValidation,
  ReservationSchema,
  SearchBikesSchema,
} from '../../lib/helper/validations';
import { JoiValidationPipe } from '../../lib/helper/validation.pipe';
import { UserRole } from '../../auth/entity/user.entity';

@Controller('bike')
export class BikeController {
  constructor(private bikeService: BikeService) {}

  @UseGuards(JwtAuthGuard)
  @Get('manager')
  async GetAll(@Request() req): Promise<BikeEntity[]> {
    if (req?.user?.role !== UserRole.MANAGER) throw new UnauthorizedException();
    return await this.bikeService.getAll();
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiValidationPipe(SearchBikesSchema))
  @Post()
  async searchBikes(@Request() req, @Body() body: any): Promise<any> {
    DateTimeValidation(body);
    return await this.bikeService.getBikes(req.user, body);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiValidationPipe(BikeSchema))
  @Post('create')
  async Create(@Request() req, @Body() bike: BikeEntity): Promise<BikeEntity> {
    if (req?.user?.role !== UserRole.MANAGER) throw new UnauthorizedException();
    return await this.bikeService.createOne(bike);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiValidationPipe(ReservationSchema))
  @Post('/book')
  async addReservation(@Body() body, @Request() req) {
    DateTimeValidation(body);
    return await this.bikeService.addReservation(body, req.user);
  }

  // @Post('/test')
  // async testRout(@Body() body) {
  //   console.log(body)
  //   const { fromDate, toDate } = body;
  //   DateTimeValidation(fromDate, toDate);
  // }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async Update(
    @Param() id: number,
    @Body() bike: BikeEntity,
    @Request() req,
  ): Promise<BikeEntity> {
    const { value, error } = BikeSchema.validate(bike);
    if (error) throw new BadRequestException(error?.details?.message);
    if (req?.user?.role !== UserRole.MANAGER) throw new UnauthorizedException();
    return await this.bikeService.update(id, value);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async Delete(@Param() id: number, @Request() req): Promise<any> {
    if (req?.user?.role !== UserRole.MANAGER) throw new UnauthorizedException();
    return await this.bikeService.delete(id);
  }
}
