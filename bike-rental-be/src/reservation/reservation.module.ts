import { Module } from '@nestjs/common';
import ReservationController from './controller/reservation.controller';
import ReservationService from './service/reservation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import ReservationEntity from './entity/reservation.entity';
import { BikeService } from '../bike/service/bike.service';
import RatingEntity from './entity/rating.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReservationEntity, RatingEntity])],
  controllers: [ReservationController],
  providers: [ReservationService, BikeService],
})
export class ReservationModule {}
