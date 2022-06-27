import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import BikeEntity from '../enitity/bike.entity';
import { Brackets, FindCondition, getRepository, In } from 'typeorm';
import UsersEntity, { UserRole } from '../../auth/entity/user.entity';
import ReservationEntity, {
  ReservationStatus,
} from '../../reservation/entity/reservation.entity';
import * as moment from 'moment';
import { PageSize } from '../../lib/constants/constants';

@Injectable()
export class BikeService {
  async getAll(): Promise<BikeEntity[]> {
    return await BikeEntity.find();
  }

  async getOne(id: number): Promise<BikeEntity | undefined> {
    return BikeEntity.findOne(id);
  }

  async createOne(bike: BikeEntity): Promise<BikeEntity> {
    return await BikeEntity.save(bike);
  }

  async getBikes(authUser: UsersEntity, { page, location, fromDate, toDate }) {
    page = Math.max(Number(page) || 1, 1);
    const where: FindCondition<BikeEntity> = {};
    if (authUser.role === UserRole.REGULAR) where.isAvailable = true;
    where.location = location;
    const reservedBikesIds: number[] = await this.getBookableBikes({
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
        await BikeService.cancelAllReservationForABike(bikeId);
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

  async addReservation({ bikeId, fromDate, toDate }, authUser: UsersEntity) {
    const bike = await this.getOne(bikeId);
    if (bike) {
      fromDate = moment(fromDate).format();
      toDate = moment(toDate).format();
      const bookableBikes = await this.getBookableBikes({ fromDate, toDate });
      if (!bookableBikes.includes(bikeId))
        throw new HttpException('Bike is already booked', 405);

      const reservation = new ReservationEntity();
      reservation.bikeId = bikeId;
      reservation.userId = authUser.id;
      reservation.fromDate = moment(fromDate).format();
      reservation.toDate = moment(toDate).format();
      reservation.status = ReservationStatus.ACTIVE;
      await reservation.save();
      return reservation;
    }
    throw new NotFoundException();
  }

  private async getBookableBikes({ fromDate, toDate }): Promise<number[]> {
    const nonBookableBikes = await getRepository(ReservationEntity)
      .createQueryBuilder('reservation')
      .where('reservation.status = :status', {
        status: ReservationStatus.ACTIVE,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where('reservation.toDate between :fromDate AND :toDate', {
            fromDate,
            toDate,
          })
            .orWhere('reservation.fromDate between :fromDate AND :toDate', {
              fromDate,
              toDate,
            })
            .orWhere(
              'reservation.fromDate < :fromDate AND reservation.toDate > :toDate',
              { fromDate, toDate },
            );
        }),
      )
      .getMany();
    const reservedBikeIds = nonBookableBikes.map((res) => res.bikeId);
    const allBikes = await this.getAll();
    return allBikes
      .filter((bike) => !reservedBikeIds.includes(bike.id))
      .map((bike) => bike.id);
  }

  private static async cancelAllReservationForABike(bikeId) {
    const reservation = await ReservationEntity.find({ bikeId });
    if (reservation.length > 0) {
      reservation.map((res) => {
        res.status = ReservationStatus.CANCEL;
        res.save();
      });
    }
  }
}
