import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BikeEntity from '../enitity/bike.entity';
import {
  Brackets,
  FindCondition,
  getRepository,
  In,
  Repository,
  UpdateResult,
} from 'typeorm';
import UsersEntity, { UserRole } from '../../auth/entity/user.entity';
import ReservationEntity, {
  ReservationStatus,
} from '../../reservation/entity/reservation.entity';
import * as moment from 'moment';
import { PageSize } from '../../lib/constants/constants';

@Injectable()
export class BikeService {
  constructor(
    @InjectRepository(BikeEntity)
    private bikeRepository: Repository<BikeEntity>,
  ) {}

  async getAll(authUser: UsersEntity): Promise<BikeEntity[]> {
    if (authUser.role === UserRole.MANAGER)
      return await this.bikeRepository.find();
    return await this.bikeRepository.find({ isAvailable: true });
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

  async create(bike: BikeEntity, authUser: UsersEntity): Promise<BikeEntity> {
    if (authUser.role == UserRole.MANAGER) {
      console.log('bike', bike);
      return await this.bikeRepository.save(bike);
    }
    return null;
  }

  async getOne(id: number): Promise<BikeEntity | undefined> {
    return this.bikeRepository.findOne(id);
  }

  async update(
    bikeId: number,
    bike: BikeEntity,
    authUser: UsersEntity,
  ): Promise<UpdateResult> {
    if (authUser.role == UserRole.MANAGER) {
      const foundOne = await this.bikeRepository.findOne(bikeId);
      if (foundOne)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return await this.bikeRepository.save({ ...foundOne, ...bike });
      else throw new NotFoundException();
    }
    throw new UnauthorizedException();
  }
  async delete(id: number, authUser: UsersEntity): Promise<any> {
    if (authUser.role == UserRole.MANAGER) {
      const foundOne = await this.bikeRepository.findOne(id);
      if (foundOne)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return await this.bikeRepository
          .delete(id)
          .then(() => ({ bikeId: id, deleted: true }));
      else throw new NotFoundException();
    }
    throw new UnauthorizedException();
  }

  async addReservation({ bikeId, fromDate, toDate }, authUser: UsersEntity) {
    fromDate = moment(fromDate).format();
    toDate = moment(toDate).format();
    const bookableBikes = await this.getBookableBikes({ fromDate, toDate });
    if (!bookableBikes.includes(bikeId))
      throw new HttpException('Bike is already booked', 405);
    const bike = await BikeEntity.findOne(bikeId);
    if (bike) {
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
    const allBikes = await BikeEntity.find({});
    const bookableBikes = allBikes
      .filter((bike) => !reservedBikeIds.includes(bike.id))
      .map((bike) => bike.id);
    return bookableBikes;
  }
}
