import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.getOrThrow('DB_HOST'),
                port: configService.getOrThrow('DB_PORT'),
                database: configService.getOrThrow('DB_DATABASE'),
                username: configService.getOrThrow('DB_USERNAME'),
                password: configService.getOrThrow('DB_PASSWORD'),

                autoLoadEntities: true,
                // WARNING: synchronize must be FALSE in production to prevent cPanel data loss
                synchronize: configService.getOrThrow<boolean>('DB_SYNCHRONIZE'),
            }),
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule implements OnModuleInit {
    private readonly logger = new Logger(DatabaseModule.name);

    constructor(private dataSource: DataSource) { }

    async onModuleInit() {
        try {
            if (this.dataSource.isInitialized) {
                this.logger.log('Database connection established successfully.');
            }
        } catch (error) {
            this.logger.error('Error connecting to the database:', error);
        }
    }

    static forFeature(models: EntityClassOrSchema[]) {
        return TypeOrmModule.forFeature([
            // ClassProvider({
            //   provide: 'EXERCISE_ENTITY',
            //   useValue: {
            //     name: 'exercises',
            //     columns: {},
            //   },
            // }),
            ...models,
        ]);
    }
}
