import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRole } from '../lib/common/enums/roles.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) { }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.usersRepository.createEntity({
      fullName: createUserDto.fullName,
      email: createUserDto.email.toLowerCase().trim(),
      password: hashedPassword,
      role: createUserDto.role || UserRole.ADMIN,
    });
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

  async findAllSalesAgents(page: number = 1, limit: number = 10) {
    return this.usersRepository.find({ role: UserRole.SALES, isDeleted: false }, page, limit);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);

    if (!user) throw new UnauthorizedException('Invalid email or password');

    if (!user.isActive)
      throw new UnauthorizedException('Account is deactivated');

    if (!user.password)
      throw new UnauthorizedException('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid email or password');

    return user;
  }

  async updateSalesAgent(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.SALES) {
      throw new BadRequestException('Can only update sales agents via this endpoint');
    }

    if (updateUserDto.email && user.email && updateUserDto.email.toLowerCase() !== user.email.toLowerCase()) {
      const emailExists = await this.findByEmail(updateUserDto.email);
      if (emailExists) {
        throw new ConflictException('Email is already in use');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.usersRepository.findOneAndUpdate({ id }, updateUserDto);
    return this.findById(id);
  }

  async softDeleteSalesAgent(id: string): Promise<void> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.SALES) {
      throw new BadRequestException('Can only delete sales agents via this endpoint');
    }

    await this.usersRepository.findOneAndUpdate({ id }, { isDeleted: true, isActive: false });
  }
}
