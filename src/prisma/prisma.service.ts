import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    constructor(private config: ConfigService) {
        const pool = new Pool({
            connectionString: config.get<string>('DATABASE_URL'),
        });
        const adapter = new PrismaPg(pool);

        super({
            adapter,
            log:
                config.get('NODE_ENV') === 'local'
                    ? ['query', 'info', 'warn', 'error']
                    : ['error'],
        });
    }

    async onModuleInit() {
        await this.$connect();
        console.log('🚀 Database connected successfully!');
    }

    async onModuleDestroy() {
        await this.$disconnect();
        console.log('🛑 Database disconnected!');
    }

    async cleanDatabase() {
        if (this.config.get('NODE_ENV') === 'production') {
            throw new Error('Cannot clean database in production');
        }

        // This logic finds all tables and truncates them (except migrations)
        const models = Reflect.getMetadata('prisma:models', this) || [];
        return Promise.all(
            models.map((model: any) =>
                this.$executeRawUnsafe(`TRUNCATE TABLE "${model.tableName}" CASCADE;`),
            ),
        );
    }
}
