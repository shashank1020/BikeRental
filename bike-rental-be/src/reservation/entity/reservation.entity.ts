import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import BikeEntity from '../../bike/enitity/bike.entity';

export enum ReservationStatus {
  ACTIVE = 'Active',
  CANCEL = 'Cancel',
}

@Entity({ name: 'reservation' })
export default class ReservationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  bikeId: number;

  @Column()
  status: string;

  @Column()
  fromDate: string;

  @Column()
  toDate: string;

  @ManyToOne(() => BikeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bikeId', referencedColumnName: 'id' })
  bike: BikeEntity;
}
