import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'bike' })
export default class BikeEntity extends BaseEntity {
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
}

// const history_schema = {
//   user1: [
//     { startdate: '1 aug', endDate: '2 aug' },
//     { startdate: '1 aug', endDate: '2 aug' },
//   ],
//   user2: [
//     { startdate: '1 aug', endDate: '2 aug' },
//     { startdate: '1 aug', endDate: '2 aug' },
//   ],
// };
