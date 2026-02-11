import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRole } from '../lib/common/enums/roles.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) { }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = new User({
      fullName: createUserDto.fullName,
      email: createUserDto.email.toLowerCase().trim(),
      password: hashedPassword,
      role: createUserDto.role || UserRole.ADMIN,
    });

    return this.usersRepository.create(user) as Promise<User>;
  }

  async findByEmail(email: string): Promise<User | null> {
    // Use query builder to properly select password field (which has select: false)
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:email)', { email: email.trim() })
      .withDeleted()
      .addSelect('user.password')
      .getOne();

    return user;
  }

  async findById(id: string): Promise<User> {
    return this.usersRepository.findOne({ id });
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);

    if (!user) throw new UnauthorizedException('Invalid email or password');

    if (!user.isActive) throw new UnauthorizedException('Account is deactivated');

    if (!user.password) throw new UnauthorizedException('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new UnauthorizedException('Invalid email or password');

    return user;
  }
}
