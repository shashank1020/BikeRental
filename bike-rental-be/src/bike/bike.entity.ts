import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type Location =
  | 'Agra'
  | 'Varanasi'
  | 'New Delhi'
  | 'Mumbai'
  | 'Hyderabad'
  | 'Jaipur'
  | 'Goa'
  | 'Delhi';

export type BikeModalTypes =
  | 'Harley Davidson'
  | 'Honda'
  | 'Kawasaki'
  | 'Triumph Bonneville'
  | 'Ducati'
  | 'BMW'
  | 'Royal Enfield Bullet'
  | 'Yamaha'
  | 'Suzuki'
  | 'TVS Jupiter'
  | 'Honda Activa'
  | 'Yamaha Fascino';

@Entity()
export class BikeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  modal: BikeModalTypes;

  @Column()
  color: string;

  @Column()
  location: Location;

  @Column()
  isAvailable: boolean;

  @Column()
  avgRating: number;

  @Column({ default: null })
  bookedTo: string | null;
}
