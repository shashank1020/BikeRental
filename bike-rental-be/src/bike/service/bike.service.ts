import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BikeEntity from '../enitity/bike.entity';
import { getRepository, Repository, UpdateResult } from 'typeorm';
import UsersEntity, { UserRole } from '../../auth/entity/user.entity';
import ReservationEntity, {
  ReservationStatus,
} from '../../reservation/entity/reservation.entity';
import moment from 'moment';

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

  async getByLocation(authUser: UsersEntity, location: string) {
    const bikes = await this.bikeRepository.find({ where: location });
    if (authUser.role === UserRole.MANAGER) return bikes;
    return bikes.filter((bike) => bike.isAvailable === true);
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
        return await this.bikeRepository
          .save({...foundOne,...bike})
      else throw new NotFoundException();
    }
    throw new UnauthorizedException();
  }
  async delete(id: number, authUser: UsersEntity): Promise<any> {
    if (authUser.role == UserRole.MANAGER) {
      const foundOne = await this.bikeRepository.findOne(id);
      if (!!foundOne)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return await this.bikeRepository
          .delete(id)
          .then(() => ({ msg: `deleted bike with id: ${id}` }));
      else throw new NotFoundException();
    }
    throw new UnauthorizedException();
  }

  async addReservation({ bikeId, fromDate, toDate }, authUser) {
    fromDate = moment(fromDate).format();
    toDate = moment(toDate).format();
    const bikeIds = await this.getNonBookedBikes({ fromDate, toDate });
    if (!bikeIds.includes(bikeId))
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

  private async getNonBookedBikes({ fromDate, toDate }): Promise<number[]> {
    const reservations = await getRepository(ReservationEntity)
      .createQueryBuilder('reservation')
      .where(
        'reservation.status = :status and ((reservation.toDate between :fromDate and :toDate) or ' +
          '(reservation.fromDate between :fromDate and :toDate) or ' +
          '(reservation.fromDate < :fromDate and res.toDate > :toDate))',
        { fromDate, toDate, status: ReservationStatus.ACTIVE },
      )
      .getMany();
    const reservedBikeIds = reservations.map((res) => res.bikeId);
    const allBikes = await BikeEntity.find({});
    return allBikes
      .filter((bike) => !reservedBikeIds.includes(bike.id))
      .map((bike) => bike.id);
  }
}
