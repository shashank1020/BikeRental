import * as Bcryptjs from 'bcrypt';
import * as moment from 'moment';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import UsersEntity, { UserRole } from './user/entity/user.entity';
import BikeEntity from './bike/enitity/bike.entity';
import ReservationEntity, {
  ReservationStatus,
} from './reservation/entity/reservation.entity';
import {
  BikeModalTypes,
  ColorTypes,
  LocationTypes,
} from './lib/constants/constants';
import RatingEntity from "./reservation/entity/rating.entity";

(async function () {
  const app = await NestFactory.createApplicationContext(AppModule);
  await UsersEntity.delete({});
  await RatingEntity.delete({});
  await BikeEntity.delete({});
  await ReservationEntity.delete({});

  const manager = new UsersEntity();
  manager.id = 1;
  manager.email = 'manager@email.com';
  manager.password = Bcryptjs.hashSync('name123', 10);
  manager.role = UserRole.MANAGER;
  await manager.save();

  for (let id = 2; id <= 5; id++) {
    const salt = await Bcryptjs.genSalt();
    const regular = new UsersEntity();
    regular.id = id;
    regular.email = `regular${id - 1}@email.com`;
    regular.password = Bcryptjs.hashSync('name123', salt);
    regular.role = UserRole.REGULAR;
    await regular.save();
  }

  for (let i = 1; i < 31; i++) {
    const bike = new BikeEntity();
    bike.id = i;
    bike.model =
      BikeModalTypes[Math.floor(Math.random() * BikeModalTypes.length)];
    bike.color = ColorTypes[Math.floor(Math.random() * ColorTypes.length)];
    bike.location =
      LocationTypes[Math.floor(Math.random() * LocationTypes.length)];
    bike.isAvailable = Math.random() >= 0.5;
    await bike.save();
  }

  const obj = {};
  for (let i = 1; i < 15; i++) {
    const reservation = new ReservationEntity();
    reservation.userId =
      Math.random() >= 0.5 ? manager.id : i % 5 <= 1 ? (i % 5) + 1 : i % 5;
    reservation.bikeId = Math.floor(Math.random() * 24) + 1;
    if (obj[reservation.bikeId.toString()]) continue;
    obj[reservation.bikeId.toString()] = true;
    reservation.status = ReservationStatus.ACTIVE;
    const randomDay = Math.floor(Math.random() * 10);
    reservation.fromDate = moment()
      .subtract(randomDay, 'day')
      .format('YYYY-MM-DD');
    reservation.toDate = moment().add(randomDay, 'day').format('YYYY-MM-DD');
    await reservation.save();
  }
  await app.close();
})();
