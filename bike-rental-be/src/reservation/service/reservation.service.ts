import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { FindCondition } from 'typeorm';
import { PageSize } from '../../lib/constants/constants';
import UsersEntity, { UserRole } from '../../auth/entity/user.entity';
import ReservationEntity, {
  ReservationStatus,
} from '../entity/reservation.entity';
import RatingEntity from '../../bike/enitity/rating.entity';
import BikeEntity from '../../bike/enitity/bike.entity';

@Injectable()
export default class ReservationService {
  async getAllReservations({ page, userId, bikeId }, authUser: UsersEntity) {
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
    // { bikeId : true } for user to check if user has rated or not
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
}
