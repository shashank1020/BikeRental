import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BikeModule } from './bike/bike.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
console.log([__dirname + '/**/*.entity{.ts,.js}']);
