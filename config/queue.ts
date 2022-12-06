import { registerAs } from '@nestjs/config';
import { RedisQueueDriver } from '@squareboat/nest-queue-redis';

export default registerAs('queue', () => {
    return {
        default: 'notifications',
        connections: {
            notifications: {
                driver: RedisQueueDriver,
                queue: process.env.QUEUE_NAME,
                host: process.env.QUEUE_HOST,
                port: +process.env.QUEUE_PORT,
                database: +process.env.QUEUE_DB,
            },
        },
    }
});