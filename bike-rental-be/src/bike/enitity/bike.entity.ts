import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'bike' })
export default class BikeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  modal: string;

  @Column()
  color: string;

  @Column()
  location: string;

  @Column()
  isAvailable: boolean;

  @Column({ default: 0 })
  avgRating: number;
}
