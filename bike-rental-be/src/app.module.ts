import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ReservationEntity from './reservation/entity/reservation.entity';
import RatingEntity from './reservation/entity/rating.entity';
import ReservationController from './reservation/controller/reservation.controller';
import ReservationService from './reservation/service/reservation.service';
import { BikeController } from './bike/controller/bike.controller';
import { BikeService } from './bike/service/bike.service';
import BikeEntity from './bike/enitity/bike.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database/bikeDB',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([ReservationEntity, RatingEntity, BikeEntity]),
  ],
  controllers: [ReservationController, BikeController],
  providers: [ReservationService, BikeService],
})
export class AppModule {}
