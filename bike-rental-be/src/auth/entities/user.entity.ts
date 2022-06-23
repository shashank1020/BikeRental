import {Entity, Column, PrimaryGeneratedColumn, BaseEntity} from 'typeorm';

export enum userRole {
  MANAGER = 'Manager',
  REGULAR = 'Regular',
}

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: userRole.REGULAR })
  role: string;
}
