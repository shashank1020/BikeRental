import {Column, Entity, PrimaryColumn} from 'typeorm';
import { userRole } from './user.entity';

@Entity()
export class CurrentUserEntity {
  @PrimaryColumn()
  username: string;

  @Column({ default: userRole.REGULAR })
  role: string;

  @Column()
  auth_token: string;

  @Column()
  isLoggedIn: boolean;
}
