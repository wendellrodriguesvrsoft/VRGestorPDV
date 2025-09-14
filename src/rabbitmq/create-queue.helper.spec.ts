import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Logger } from '@nestjs/common';
import { Channel, ConsumeMessage } from 'amqplib';
import { createQueue } from './create-queue.helper'; // ajuste o path

jest.mock('@nestjs/common', () => ({
  Logger: {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('createQueue', () => {
  let mockAmqp: jest.Mocked<AmqpConnection>;
  let mockChannel: jest.Mocked<Channel>;
  let handler: jest.Mock;

  beforeEach(() => {
    process.env.API_NAME = 'test-api';
    process.env.DL_PATTERN = 'custom-dl-pattern';
    process.env.DL_QUEUE = 'custom-deadletter';

    handler = jest.fn();

    // Todos os métodos que são await dentro de createQueue devem retornar Promise
    mockChannel = {
      assertQueue: jest.fn().mockResolvedValue({}),
      bindQueue: jest.fn().mockResolvedValue({}),
      prefetch: jest.fn().mockResolvedValue({}),
      consume: jest.fn().mockResolvedValue({}),
      ack: jest.fn(),
      nack: jest.fn(),
      sendToQueue: jest.fn(),
    } as any;

    mockAmqp = {
      managedConnection: {
        createChannel: jest.fn().mockImplementation(({ setup }: any) => {
          return {
            // waitForConnect chama o setup para simular o comportamento real
            waitForConnect: async () => setup(mockChannel),
            setup: async () => setup(mockChannel),
          };
        }),
      },
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if API_NAME is not defined', async () => {
    delete process.env.API_NAME;

    await expect(
      createQueue(mockAmqp, 'exchange', [1], handler),
    ).rejects.toThrow(/API_NAME não definido/);
  });

  it('should configure queues and consumers', async () => {
    await createQueue(mockAmqp, 'exchange', [1], handler);

    expect(mockChannel.assertQueue).toHaveBeenCalledWith('exchange-1-dlq', {
      durable: true,
    });
    expect(mockChannel.assertQueue).toHaveBeenCalledWith(
      'exchange-1-retry',
      expect.objectContaining({
        durable: true,
        arguments: expect.any(Object),
      }),
    );
    expect(mockChannel.assertQueue).toHaveBeenCalledWith(
      'exchange-1',
      expect.objectContaining({
        durable: true,
        arguments: expect.any(Object),
      }),
    );

    expect(mockChannel.bindQueue).toHaveBeenCalledWith(
      'exchange-1',
      'exchange',
      'rede.1.exchange',
    );
    expect(mockChannel.prefetch).toHaveBeenCalledWith(1);
    expect(mockChannel.consume).toHaveBeenCalledTimes(2);

    expect(Logger.log).toHaveBeenCalledWith(
      expect.stringContaining('✅ Listening on queue [exchange-1]'),
      'RabbitMQ',
    );
  });

  it('should ack message on successful handler', async () => {
    let queueConsumer: ((msg: ConsumeMessage | null) => void) | undefined;

    mockChannel.consume.mockImplementation(
      (queue: string, cb: (msg: ConsumeMessage | null) => void) => {
        if (!queue.endsWith('-dlq')) queueConsumer = cb;
        return {} as any;
      },
    );

    await createQueue(mockAmqp, 'exchange', [1], handler);

    const msg: ConsumeMessage = {
      content: Buffer.from(JSON.stringify({ foo: 'bar' })),
      fields: {} as any,
      properties: { headers: {} } as any,
    };

    await queueConsumer!(msg);

    expect(handler).toHaveBeenCalledWith({ foo: 'bar' }, msg, mockChannel);
    expect(mockChannel.ack).toHaveBeenCalledWith(msg);
  });

  it('should nack and retry if handler throws and retryCount < 3', async () => {
    let queueConsumer: ((msg: ConsumeMessage | null) => void) | undefined;

    mockChannel.consume.mockImplementation(
      (queue: string, cb: (msg: ConsumeMessage | null) => void) => {
        if (!queue.endsWith('-dlq')) queueConsumer = cb;
        return {} as any;
      },
    );

    handler.mockRejectedValueOnce(new Error('boom'));

    await createQueue(mockAmqp, 'exchange', [1], handler);

    const msg: ConsumeMessage = {
      content: Buffer.from(JSON.stringify({ foo: 'bar' })),
      fields: {} as any,
      properties: { headers: { 'x-death': [{ count: 1 }] } } as any,
    };

    await queueConsumer!(msg);

    expect(Logger.error).toHaveBeenCalled();
    expect(Logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('retrying [2/3] - exchange-1'),
    );
    expect(mockChannel.nack).toHaveBeenCalledWith(msg, false, false);
  });

  it('should send to DLQ if handler fails 3 times', async () => {
    let queueConsumer: ((msg: ConsumeMessage | null) => void) | undefined;

    mockChannel.consume.mockImplementation(
      (queue: string, cb: (msg: ConsumeMessage | null) => void) => {
        if (!queue.endsWith('-dlq')) queueConsumer = cb;
        return {} as any;
      },
    );

    handler.mockRejectedValueOnce(new Error('failed thrice'));

    await createQueue(mockAmqp, 'exchange', [1], handler);

    const msg: ConsumeMessage = {
      content: Buffer.from(JSON.stringify({ foo: 'bar' })),
      fields: {} as any,
      properties: { headers: { 'x-death': [{ count: 3 }] } } as any,
    };

    await queueConsumer!(msg);

    expect(Logger.error).toHaveBeenCalledWith(
      expect.stringContaining(
        '❌ Failed after 3 retries, sending to DLQ - exchange-1',
      ),
    );
    expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
      'exchange-1-dlq',
      expect.any(Buffer),
      { headers: msg.properties.headers },
    );
    expect(mockChannel.ack).toHaveBeenCalledWith(msg);
  });

  it('should forward dlq messages to central DL queue', async () => {
    let dlqConsumer: ((msg: ConsumeMessage | null) => void) | undefined;

    mockChannel.consume.mockImplementation(
      (queue: string, cb: (msg: ConsumeMessage | null) => void) => {
        if (queue.endsWith('-dlq')) dlqConsumer = cb;
        return {} as any;
      },
    );

    await createQueue(mockAmqp, 'exchange', [1], handler);

    const dlqMsg: ConsumeMessage = {
      content: Buffer.from(JSON.stringify({ payload: { foo: 'bar' } })),
      fields: {} as any,
      properties: { headers: {} } as any,
    };

    await dlqConsumer!(dlqMsg);

    expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
      'custom-deadletter',
      expect.any(Buffer),
      {},
    );
    expect(mockChannel.ack).toHaveBeenCalledWith(dlqMsg);
  });
});
