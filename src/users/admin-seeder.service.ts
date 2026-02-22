import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { UserRole } from '../lib/common/enums/roles.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminSeederService implements OnModuleInit {
  private readonly logger = new Logger(AdminSeederService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedAdmin();
  }

  private async seedAdmin(): Promise<void> {
    const adminEmail = this.configService.getOrThrow<string>('ADMIN_EMAIL');
    const adminPassword =
      this.configService.getOrThrow<string>('ADMIN_PASSWORD');

    // Check if admin already exists using count to avoid NotFoundException
    const adminCount = await this.usersRepository.count({
      where: { email: adminEmail.toLowerCase().trim() },
    });

    if (adminCount > 0) {
      this.logger.log('Master admin already exists, skipping seed.');
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = new User({});
    admin.fullName = 'Master Admin';
    admin.email = adminEmail.toLowerCase().trim();
    admin.password = hashedPassword;
    admin.role = UserRole.ADMIN;
    admin.isActive = true;

    await this.usersRepository.create(admin);
    this.logger.log(`Master admin created with email: ${adminEmail}`);
  }
}
