import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'rating' })
export default class RatingEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  bikeId: number;

  @Column()
  rating: number;

  @Column()
  reservationId: number;
}
