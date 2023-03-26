import { AppEnvironment } from '@lib/backend-shared';
import { createClient, RedisClientType, RedisDefaultModules } from 'redis';


export class RedisCacheClient {

  private static isConnected: boolean = false;
  private static client?: RedisClientType<RedisDefaultModules>;

  private static closeConnectionTimeout: NodeJS.Timeout;

  private static async checkConnection() {
    if (RedisCacheClient.isConnected) {
      RedisCacheClient.timeoutCloseConnection();
      return;
    }

    const client: RedisClientType<RedisDefaultModules> = createClient({ url: AppEnvironment.REDIS_URL });
    await client.connect();
    RedisCacheClient.client = client;
    RedisCacheClient.isConnected = true;

    RedisCacheClient.timeoutCloseConnection();
  }

  private static timeoutCloseConnection() {
    if (RedisCacheClient.closeConnectionTimeout) {
      // there is an active timeout; clear it
      console.log(`Resetting cache connection timeout`);
      clearTimeout(RedisCacheClient.closeConnectionTimeout);
    }

    const closeConnectionTimeout = setTimeout(() => {
      // if idle for 5 minutes, close connection
      console.log(`Disconnecting from redis cache...`);
      RedisCacheClient.client?.disconnect().then(() => {
        RedisCacheClient.client = undefined;
        RedisCacheClient.isConnected = false;
        console.log(`Disconnected from redis cache.`);
      });
    }, 1000 * 60 * 5);

    RedisCacheClient.closeConnectionTimeout = closeConnectionTimeout;
  }



  static async get(key: string) {
    await RedisCacheClient.checkConnection();

    return RedisCacheClient.client!.get(key);
  }

  static async set(key: string, value: any) {
    await RedisCacheClient.checkConnection();

    return RedisCacheClient.client!.set(key, value);
  }

  static async delete(key: string) {
    await RedisCacheClient.checkConnection();

    return RedisCacheClient.client!.del(key);
  }

}