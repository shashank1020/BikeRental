import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

export enum userRole {
  MANAGER = 'Manager',
  REGULAR = 'Regular',
}

@Entity({ name: 'user' })
export default class UsersEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: userRole.REGULAR })
  role: string;

  @Column({
    nullable: true,
  })
  history: string | null;
}

//
// const history_schema = {
//   bike1: [
//     { startdate: '1 aug', endDate: '2 aug' },
//     { startdate: '1 aug', endDate: '2 aug' },
//   ],
//   bike2: [
//     { startdate: '1 aug', endDate: '2 aug' },
//     { startdate: '1 aug', endDate: '2 aug' },
//   ],
// }
