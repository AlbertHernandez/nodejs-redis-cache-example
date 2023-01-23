import { createClient } from "redis";

type CacheValue = Record<string, unknown> | number | string | boolean;

export class CacheManager {
  private readonly redisClient;

  constructor(url: string) {
    this.redisClient = createClient({
      url,
    });
    this.redisClient.on("error", (error) => {
      console.error(`Redis client error`, error);
    });
  }

  private async connect() {
    await this.redisClient.connect();
  }

  private async quit() {
    await this.redisClient.quit();
  }

  async set(
    key: string,
    value: CacheValue,
    options: { expirationInMs?: number } = {}
  ): Promise<void> {
    try {
      await this.connect();

      const stringifiedValue =
        typeof value === "string"
          ? value
          : this.stringifyValueForStoring(value);

      await this.redisClient.set(key, stringifiedValue, {
        PX: options.expirationInMs,
      });
    } finally {
      await this.quit();
    }
  }

  async get(key: string): Promise<CacheValue | null> {
    try {
      await this.connect();

      const value = await this.redisClient.get(key);

      if (!value) {
        return null;
      }

      return this.transformValueFromStorageFormat(value);
    } catch (error) {
      console.error("Error getting data from redis");
      return null;
    } finally {
      await this.quit();
    }
  }

  private stringifyValueForStoring(value: CacheValue): string {
    return JSON.stringify(value);
  }

  private transformValueFromStorageFormat(value: string): CacheValue {
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  }
}
