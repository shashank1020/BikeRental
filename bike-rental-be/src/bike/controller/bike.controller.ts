import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Request,
  Body,
  UseGuards,
  UnauthorizedException,
  UsePipes,
  BadRequestException,
} from '@nestjs/common';
import { BikeService } from '../service/bike.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import BikeEntity from '../enitity/bike.entity';
import { UpdateResult } from 'typeorm';
import {
  BikeSchema,
  BikesByLocationSchema,
  DateTimeValidation,
  ReservationSchema,
} from '../../lib/helper/validations';
import { JoiValidationPipe } from '../../lib/helper/validation.pipe';

@Controller('bike')
export class BikeController {
  constructor(private bikeService: BikeService) {}

  @UseGuards(JwtAuthGuard)
  @Get('manager')
  async GetAll(@Request() req): Promise<BikeEntity[]> {
    return await this.bikeService.getAll(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiValidationPipe(BikesByLocationSchema))
  @Post()
  async getByLocation(
    @Request() req,
    @Body() location: string,
  ): Promise<BikeEntity[]> {
    return await this.bikeService.getByLocation(req.user, location);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiValidationPipe(BikeSchema))
  @Post('create')
  async Create(@Request() req, @Body() bike: BikeEntity): Promise<BikeEntity> {
    const newBike = await this.bikeService.create(bike, req.user);
    if (!newBike) throw new UnauthorizedException();
    return newBike;
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiValidationPipe(ReservationSchema))
  @Post('/book')
  async addReservation(@Body() body, @Request() req) {
    return await this.bikeService.addReservation(body, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async Update(
    @Param() id: number,
    @Body() bike: BikeEntity,
    @Request() req,
  ): Promise<UpdateResult> {
    const { value, error } = BikeSchema.validate(bike);
    console.log(value)
    if (error) throw new BadRequestException(error?.details?.message);
    return await this.bikeService.update(id, value, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async Delete(@Param() id: number, @Request() req): Promise<any> {
    return await this.bikeService.delete(id, req.user);
  }
}
