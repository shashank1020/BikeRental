import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

export enum UserRole {
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

  @Column({ default: UserRole.REGULAR })
  role: string;
}
