import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BikeEntity from '../enitity/bike.entity';
import { Repository, UpdateResult } from 'typeorm';
import UsersEntity, { userRole} from '../../user/entity/user.entity';

@Injectable()
export class BikeService {
  constructor(
    @InjectRepository(BikeEntity)
    private bikeRepository: Repository<BikeEntity>,
  ) {}

  async getAll(user: UsersEntity): Promise<BikeEntity[]> {
    if (user.role === userRole.MANAGER) return await this.bikeRepository.find();
    return await this.bikeRepository.find({ isAvailable: true });
  }

  async create(bike: BikeEntity, user: UsersEntity): Promise<BikeEntity> {
    console.log(bike)
    if (user.role == userRole.MANAGER) {
      console.log('bike', bike);
      return await this.bikeRepository.save(bike);
    }
    return null;
  }

  async getOne(id: number): Promise<BikeEntity | undefined> {
    return this.bikeRepository.findOne(id);
  }

  async update(
    id: number,
    bike: BikeEntity,
    user: UsersEntity,
  ): Promise<UpdateResult> {
    if (user.role == userRole.MANAGER) {
      const foundOne = await this.bikeRepository.findOne(id);
      if (!!foundOne)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return await this.bikeRepository
          .update(id, bike)
          .then(() => ({ msg: `Updated bike with id: ${id}`, updated: true }));
      else throw new NotFoundException();
    }

    throw new UnauthorizedException();
  }

  async delete(id: number, user: UsersEntity): Promise<any> {
    if (user.role == userRole.MANAGER) {
      const foundOne = await this.bikeRepository.findOne(id);
      if (!!foundOne)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return await this.bikeRepository
          .delete(id)
          .then(() => ({ msg: `deleted bike with id: ${id}`, deleted: true }));
      else throw new NotFoundException();
    }
    throw new UnauthorizedException();
  }

  async getByLocation(user: UsersEntity, location: string) {
    const bikes = await this.bikeRepository.find({ where: location });
    if (user.role === userRole.MANAGER) return bikes;
    return bikes.filter((bike) => bike.isAvailable === true);
  }
}
