import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

export enum UserRole {
  MANAGER = 'Manager',
  REGULAR = 'Regular',
}
export interface ReturnUser {
  id: number;
  email: string;
  role: string;
}

export interface InputUser {
  email: string;
  role?: string;
  password?: string;
  addRoleByManager?: boolean;
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
