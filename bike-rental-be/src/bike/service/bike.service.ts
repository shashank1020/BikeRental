import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BikeEntity, Location } from '../bike.entity';
import { Repository, UpdateResult } from 'typeorm';
import { userRole, Users } from '../../auth/entities/user.entity';

@Injectable()
export class BikeService {
  constructor(
    @InjectRepository(BikeEntity)
    private bikeRepository: Repository<BikeEntity>,
  ) {}

  async getAll(user: Users): Promise<BikeEntity[]> {
    if (user.role === userRole.MANAGER) return await this.bikeRepository.find();
    return await this.bikeRepository.find({ isAvailable: true });
  }

  async create(bike: BikeEntity, user: Users): Promise<BikeEntity> {
    if (user.role == userRole.MANAGER) {
      console.log('bike', bike)
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
    user: Users,
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

  async delete(id: number, user: Users): Promise<any> {
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

  async getByLocation(user: Users, location: Location) {
    const bikes = await this.bikeRepository.find({ where: location });
    if (user.role === userRole.MANAGER) return bikes;
    return bikes.filter((bike) => bike.isAvailable === true);
  }
}
