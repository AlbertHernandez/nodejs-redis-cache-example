import { CacheManager } from "./cache-manager";
import { sleep } from "./sleep";

export class UserService {
  constructor(private readonly cacheManager: CacheManager) {}

  async runExpensiveTask(userId: string) {
    const cacheKey = `UserService_runExpensiveTask_${userId}`;
    const cachedValue = await this.cacheManager.get(cacheKey);
    if (cachedValue) {
      return cachedValue;
    }

    console.log(`Running expensive task: ${userId}`);
    await sleep(3000);
    console.log(`Finished expensive task: ${userId}`);

    const result = { userId };

    await this.cacheManager.set(cacheKey, result, {
      expirationInMs: 10000,
    });

    return result;
  }
}
