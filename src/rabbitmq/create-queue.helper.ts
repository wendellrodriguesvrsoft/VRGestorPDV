import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Logger } from '@nestjs/common';
import { Channel, ConsumeMessage } from 'amqplib';

type MessageHandler<T = any> = (
  payload: T,
  msg: any,
  channel: Channel,
) => Promise<void> | void;

export async function createQueue(
  amqp: AmqpConnection,
  exchange: string,
  pdv: number,
  handler: MessageHandler,
) {
  const api = process.env.API_NAME;
  if (!api) {
    throw new Error(`
            ********************************
            * API_NAME não definido no env *
            ********************************
        `);
  }

  const dlPattern = process.env.DL_PATTERN ?? 'criar-deadletter';
  const dlQueue = process.env.DL_QUEUE ?? 'vrmaster.monitor-filas.deadletter';

  const channelWrapper = amqp.managedConnection.createChannel({
    json: true,
    setup: async (channel: Channel) => {
        const queue = `${exchange}-${pdv}`;
        const retryQueue = `${queue}-retry`;
        const dlq = `${queue}-dlq`;
        const routingKey = `rede.${pdv}.${exchange}`;

        await channel.assertQueue(dlq, { durable: true });

        await channel.assertQueue(retryQueue, {
          durable: true,
          arguments: {
            'x-dead-letter-exchange': '',
            'x-dead-letter-routing-key': queue,
            'x-message-ttl': 5000,
          },
        });

        await channel.assertQueue(queue, {
          durable: true,
          arguments: {
            'x-dead-letter-exchange': '',
            'x-dead-letter-routing-key': retryQueue,
          },
        });

        await channel.bindQueue(queue, exchange, routingKey);
        await channel.prefetch(1);

        await channel.consume(queue, async (msg) => {
          if (!msg) return;

          const payload = JSON.parse(msg.content.toString());
          const headers = msg.properties.headers || {};
          const death = headers['x-death'] || [];
          const retryCount = death[0]?.count || 0;

          try {
            await handler(payload, msg, channel);
            channel.ack(msg);
          } catch (err: unknown) {
            if (retryCount < 3) {
              Logger.error(err);
              Logger.warn(
                `⚠️ Error, retrying [${retryCount + 1}/3] - ${queue}`,
              );
              channel.nack(msg, false, false);
            } else {
              Logger.error(
                `❌ Failed after 3 retries, sending to DLQ - ${queue}`,
              );
              const erro = err instanceof Error ? err.message : 'Unknown error';

              const buffer = Buffer.from(
                JSON.stringify({
                  payload,
                  erro,
                  routingKey,
                  exchange,
                  api,
                }),
              );
              channel.sendToQueue(dlq, buffer, {
                headers: msg.properties.headers,
              });
              channel.ack(msg);
            }
          }
        });

        await channel.consume(dlq, async (msg) => {
          const data = JSON.parse(msg?.content.toString() as string);

          channel.sendToQueue(
            dlQueue,
            Buffer.from(
              JSON.stringify({
                data,
                pattern: dlPattern,
              }),
            ),
            {},
          );
          channel.ack(msg as ConsumeMessage);
        });

        Logger.log(
          `✅ Listening on queue [${queue}] with [${routingKey}]`,
          'RabbitMQ',
        );
    },
  });

  await channelWrapper.waitForConnect();
}
