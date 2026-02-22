import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { AdminSeederService } from './admin-seeder.service';
import { DatabaseModule } from '../lib/common/database/sql/database.module';
import { User } from './entities/user.entity';

@Module({
  imports: [DatabaseModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, AdminSeederService],
  exports: [UsersService],
})
export class UsersModule {}
