import { Module } from '@nestjs/common';
import { BikeController } from './controller/bike.controller';
import { BikeService } from './service/bike.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BikeEntity } from './bike.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BikeEntity])],
  controllers: [BikeController],
  providers: [BikeService],
})
export class BikeModule {}
