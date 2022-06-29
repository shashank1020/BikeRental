import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import BikeEntity from '../enitity/bike.entity';
import { FindCondition, In } from 'typeorm';
import { InputUser, UserRole } from '../../user/entity/user.entity';
import * as moment from 'moment';
import { PageSize } from '../../lib/constants/constants';
import ReservationService from '../../reservation/service/reservation.service';

@Injectable()
export class BikeService {
  constructor(
    @Inject(forwardRef(() => ReservationService))
    private reservationService: ReservationService,
  ) {}
  async getAll(): Promise<BikeEntity[]> {
    return await BikeEntity.find();
  }

  async getOne(id: number): Promise<BikeEntity | undefined> {
    return BikeEntity.findOne(id);
  }

  async createOne(bike: BikeEntity): Promise<BikeEntity> {
    return await BikeEntity.save(bike);
  }

  async getBikes(authUser: InputUser, { page, location, fromDate, toDate }) {
    page = Math.max(Number(page) || 1, 1);
    const where: FindCondition<BikeEntity> = {};
    if (authUser.role === UserRole.REGULAR) where.isAvailable = true;
    where.location = location;
    const reservedBikesIds: number[] =
      await this.reservationService.getBookableBikes({
        fromDate: moment(fromDate).format(),
        toDate: moment(toDate).format(),
      });
    if (reservedBikesIds.length > 0) where.id = In(reservedBikesIds);
    const bikes = await BikeEntity.find({
      where,
      take: PageSize,
      skip: (page - 1) * PageSize,
    });
    const bikeCount = await BikeEntity.count({ where });
    const pageCount = Math.ceil(bikeCount / PageSize);
    return { bikes, page, pageCount };
  }

  async update(bikeId: number, bike: BikeEntity): Promise<BikeEntity> {
    const foundOne = await this.getOne(bikeId);
    if (foundOne) {
      if (foundOne.isAvailable === true && bike.isAvailable === false)
        await this.reservationService.cancelAllReservationForABike(bikeId);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return await BikeEntity.save({ ...foundOne, ...bike });
    } else throw new NotFoundException();
  }
  async delete(id: number): Promise<any> {
    const foundOne = await this.getOne(id);
    if (foundOne) {
      return await BikeEntity.delete(id).then(() => ({
        bikeId: Object.values(id),
        deleted: true,
      }));
    } else throw new NotFoundException();
  }
}
