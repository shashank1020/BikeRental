import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import BikeEntity from '../../bike/enitity/bike.entity';

@Entity({ name: 'reservation' })
export default class ReservationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fromDateTime: string;

  @Column()
  toDateTime: string;

  @Column()
  userId: number;

  @Column()
  bikeId: number;

  @Column()
  status: 'active' | 'cancel';

  @ManyToOne(() => BikeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bikeId', referencedColumnName: 'id' })
  bike: BikeEntity;
}
