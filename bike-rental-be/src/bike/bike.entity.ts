import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export const LocationTypes = [
  'Agra',
  'Varanasi',
  'New Delhi',
  'Mumbai',
  'Hyderabad',
  'Jaipur',
  'Goa',
  'Delhi',
];

export const BikeModalTypes = [
  'Harley Davidson',
  'Honda',
  'Kawasaki',
  'Triumph Bonneville',
  'Ducati',
  'BMW',
  'Royal Enfield Bullet',
  'Yamaha',
  'Suzuki',
  'TVS Jupiter',
  'Honda Activa',
  'Yamaha Fascino',
];

export const ColorTypes = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'indigo',
  'violet',
];

@Entity()
export class BikeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  modal: string;

  @Column()
  color: string;

  @Column()
  location: string;

  @Column()
  isAvailable: boolean;

  @Column()
  avgRating: number;

  @Column({ default: null })
  bookedTo: string | null;
}
