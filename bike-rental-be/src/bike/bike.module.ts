import { Module } from '@nestjs/common';
import { BikeController } from './controller/bike.controller';
import { BikeService } from './service/bike.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import BikeEntity from './enitity/bike.entity';
import ReservationService from '../reservation/service/reservation.service';

@Module({
  imports: [TypeOrmModule.forFeature([BikeEntity])],
  controllers: [BikeController],
  providers: [BikeService, ReservationService],
})
export class BikeModule {}
