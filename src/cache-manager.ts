import { createClient } from "redis";

type CacheValue = Record<string, unknown> | number | string | boolean;

export class CacheManager {
  private readonly client;
  constructor(url: string) {
    this.client = createClient({
      url,
    });
    this.client.on("error", (error) => {
      console.error(`Redis client error`, error);
    });
  }

  async connectIfNecessary(): Promise<void> {
    if (this.client.isReady) {
      return;
    }

    await this.client.connect();
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.connectIfNecessary();
      await this.client.ping();
      return true;
    } catch (error) {
      return false;
    }
  }

  async set(
    key: string,
    value: CacheValue,
    options: { expirationInMs?: number } = {}
  ): Promise<void> {
    await this.connectIfNecessary();

    const stringifiedValue =
      typeof value === "string" ? value : this.stringifyValueForStoring(value);

    await this.client.set(key, stringifiedValue, {
      PX: options.expirationInMs,
    });
  }

  async get(key: string): Promise<CacheValue | null> {
    await this.connectIfNecessary();
    const value = await this.client.get(key);

    if (!value) {
      return null;
    }

    return this.transformValueFromStorageFormat(value);
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
