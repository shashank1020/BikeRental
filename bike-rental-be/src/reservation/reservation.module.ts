import { Module } from '@nestjs/common';
import ReservationController from './controller/reservation.controller';
import ReservationService from './service/reservation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import ReservationEntity from './entity/reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReservationEntity])],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
