import { Module } from '@nestjs/common';
import { BikeController } from './controller/bike.controller';
import { BikeService } from './service/bike.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import BikeEntity from './enitity/bike.entity';
import RatingEntity from './enitity/rating.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BikeEntity, RatingEntity])],
  controllers: [BikeController],
  providers: [BikeService],
})
export class BikeModule {}
