// rabbitmq.module.ts
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule,
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const user = config.get<string>('QUEUE_LOGIN') || 'guest';
        const password = config.get<string>('QUEUE_PASSWORD') || 'guest';
        const host = config.get<string>('QUEUE_DOCKER') || 'vrrabbitmq';
        const port = config.get<number>('QUEUE_PORT') || 5672;
        console.log('****************');
        console.log('RabbitMQ Configurations:');
        console.log(`  User: ${user}`);
        console.log(`  Password: ${password}`);
        console.log(`  Host: ${host}`);
        console.log(`  Port: ${port}`);

        return {
          exchanges: [
            {
              name: 'vrmaster.compra.sugestao-de-compra-by-divisao-fornecedor',
              type: 'topic',
            },
          ],
          uri: `amqp://${user}:${password}@${host}:${port}`,
          connectionInitOptions: { wait: true },
        };
      },
    }),
  ],
  exports: [RabbitMQModule],
})
export class RabbitMQSharedModule { }
