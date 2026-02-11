import {
    CreateDateColumn,
    DeleteDateColumn,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export class AbstractEntity<T> {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Index()
    @DeleteDateColumn()
    deletedAt?: Date;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    constructor(entity: Partial<T>) {
        Object.assign(this, entity);
    }
}
