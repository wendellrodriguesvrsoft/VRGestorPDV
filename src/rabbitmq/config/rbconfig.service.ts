import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxy,
  ClientProxyFactory,
  Closeable,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class RbConfigService {
  constructor(private configService: ConfigService) {}

  async createRabbitmqOptions(queue: string): Promise<ClientProxy & Closeable> {
    const user = this.configService.get<string>('QUEUE_LOGIN') || 'guest';
    const password =
      this.configService.get<string>('QUEUE_PASSWORD') || 'guest';
    const host = this.configService.get<string>('QUEUE_DOCKER') || 'rabbitmq';
    const port = this.configService.get<number>('QUEUE_PORT') || 5672;

    return Promise.resolve(
      ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${user}:${password}@${host}:${port}`],
          queue,
          prefetchCount: 1,
          queueOptions: {
            durable: true,
          },
          persistent: true,
          noAck: false,
        },
      }),
    );
  }
}
