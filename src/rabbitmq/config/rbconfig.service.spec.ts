import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { RbConfigService } from './rbconfig.service';

describe('RbConfigService', () => {
  let service: RbConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RbConfigService,
        {
          provide: ConfigService,
          useValue: {
            constructor: jest.fn(),
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RbConfigService>(RbConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be return ClientProxyFactory', async () => {
    const proxy = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://guest:guest@rabbitmq:5672`],
        queue: 'vrmonitor',
        prefetchCount: 1,
        noAck: false,
        persistent: true,
        queueOptions: {
          durable: true,
        },
      },
    });

    expect(service.createRabbitmqOptions('vrmonitor')).resolves.toStrictEqual(
      proxy,
    );
  });
});
