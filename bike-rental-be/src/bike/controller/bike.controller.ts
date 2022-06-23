import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Request,
  Body,
  UseGuards, UnauthorizedException,
} from '@nestjs/common';
import { BikeService } from '../service/bike.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { BikeEntity, Location } from '../bike.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('bike')
export class BikeController {
  constructor(private bikeService: BikeService) {}

  @UseGuards(JwtAuthGuard)
  @Get('manager')
  async GetAll(@Request() req): Promise<BikeEntity[]> {
    return await this.bikeService.getAll(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async getBike(@Request() req, @Body() location: Location): Promise<BikeEntity[]> {
    return await this.bikeService.getByLocation(req.user, location);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async Create(@Request() req, @Body() bike: BikeEntity): Promise<BikeEntity> {
    const newBike = await this.bikeService.create(bike, req.user);
    if (!newBike) throw new UnauthorizedException();
    return newBike;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async Update(
    @Param() id: number,
    @Body() bike: BikeEntity,
    @Request() req,
  ): Promise<UpdateResult> {
    return await this.bikeService.update(id, bike, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async Delete(@Param() id: number, @Request() req): Promise<any> {
    return await this.bikeService.delete(id, req.user);
  }
}
