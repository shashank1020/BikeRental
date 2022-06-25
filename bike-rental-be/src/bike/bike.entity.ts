import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


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

  @Column({ type: 'datetime', nullable: true })
  start_date: Date | null;

  @Column({ type: 'datetime', nullable: true })
  end_date: Date | null;

  @Column({
    nullable: true,
  })
  history: string | null;
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
