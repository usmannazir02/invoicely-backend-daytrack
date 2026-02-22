import { AbstractEntity } from '../../lib/common/database/sql/abstract.entity';
import { Column, Entity, BeforeInsert, BeforeUpdate, Unique } from 'typeorm';
import { UserRole } from '../../lib/common/enums/roles.enum';

@Unique(['email'])
@Entity()
export class User extends AbstractEntity<User> {
  @Column({ nullable: true })
  fullName?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ADMIN,
  })
  role: UserRole;

  @Column({ nullable: true, select: false })
  password?: string;

  @Column({ nullable: true })
  otp?: string;

  @Column({ nullable: true })
  otpExpireAt?: Date;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ nullable: true, select: false })
  refreshToken?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  validateEmail() {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
  }
}
