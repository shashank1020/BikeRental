import {
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Brackets, FindCondition, getRepository } from 'typeorm';
import { PageSize } from '../../lib/constants/constants';
import UsersEntity, { UserRole } from '../../user/entity/user.entity';
import ReservationEntity, {
  ReservationStatus,
} from '../entity/reservation.entity';
import RatingEntity from '../entity/rating.entity';
import BikeEntity from '../../bike/enitity/bike.entity';
import * as moment from 'moment';
import { BikeService } from '../../bike/service/bike.service';

@Injectable()
export default class ReservationService {
  constructor(
    @Inject(forwardRef(() => BikeService))
    private bikeService: BikeService,
  ) {}

  async getSearchedReservation(
    { page, userId, bikeId },
    authUser: UsersEntity,
  ) {
    page = Math.max(Number(page) || 1, 1);
    const where: FindCondition<ReservationEntity> = {};
    if (authUser.role === UserRole.MANAGER) {
      if (bikeId) where.bikeId = bikeId;
      if (userId) where.userId = userId;
      if (!bikeId && !userId) where.userId = authUser.id;
    } else {
      where.userId = authUser.id;
    }

    const reservations = await ReservationEntity.find({
      where,
      relations: ['bike'],
      take: PageSize,
      skip: (page - 1) * PageSize,
    });

    const ratings = await RatingEntity.find({ userId: authUser.id });
    const ratingMap = ratings.reduce((acc, rating) => {
      acc[rating.reservationId] = rating.rating;
      return acc;
    }, {});

    reservations.map((reservation) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      reservation.userRating = ratingMap[reservation.id];
    });

    const reservationCount = await ReservationEntity.count({ where });
    const pageCount = Math.ceil(reservationCount / PageSize);
    return { reservations, page, pageCount };
  }

  async cancelReservation(reservationId: string, authUser: UsersEntity) {
    const reservation = await ReservationEntity.findOne({
      where: {
        id: reservationId,
        userId: authUser.id,
      },
    });
    if (reservation) {
      if (reservation.status === ReservationStatus.CANCEL)
        throw new HttpException('Reservation is already cancelled', 400);
      reservation.status = ReservationStatus.CANCEL;
      await reservation.save();
      return {};
    }
  }

  async addReservation({ bikeId, fromDate, toDate }, authUser: UsersEntity) {
    const bike = await this.bikeService.getOne(bikeId);
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

  async addRating({ reservationId, rate }, authUser: UsersEntity) {
    const res = await ReservationEntity.findOne(reservationId);
    if (res.status === ReservationStatus.CANCEL)
      throw new HttpException('Cancelled reservation cannot be rated.', 400);
    if (res) {
      const { bikeId } = res;
      let rating = await RatingEntity.findOne({
        where: {
          bikeId,
          reservationId,
          userId: authUser.id,
        },
      });
      if (rating) {
        throw new HttpException(
          'You have already rated for this reservation',
          400,
        );
      } else {
        rating = new RatingEntity();
        rating.userId = authUser.id;
        rating.bikeId = res.bikeId;
        rating.reservationId = res.id;
        rating.rating = rate;
        await rating.save();
        await this.updateBikeRating(res.bikeId);
        return rating;
      }
    } else throw new NotFoundException();
  }

  async updateBikeRating(bikeId: number) {
    const bike = await BikeEntity.findOne(bikeId);
    const ratings = await RatingEntity.find({ where: { bikeId } });
    const totalRatings = ratings.reduce(
      (totalRating, review) => review.rating + totalRating,
      0,
    );
    bike.avgRating =
      ratings.length === 0
        ? 0
        : Number(Number(totalRatings / ratings.length).toFixed(2));
    await bike.save();
  }

  async getBookableBikes({ fromDate, toDate }): Promise<number[]> {
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
    const allBikes = await this.bikeService.getAll();
    return allBikes
      .filter((bike) => !reservedBikeIds.includes(bike.id))
      .map((bike) => bike.id);
  }

  async cancelAllReservationForABike(bikeId) {
    const reservation = await ReservationEntity.find({ bikeId });
    if (reservation.length > 0) {
      reservation.map((res) => {
        res.status = ReservationStatus.CANCEL;
        res.save();
      });
    }
  }
}
