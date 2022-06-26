import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BikeModule } from './bike/bike.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [
    AuthModule,
    BikeModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database/bikeDB',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ReservationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
