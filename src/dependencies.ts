import { CacheManager } from "./cache-manager";
import { config } from "./config";
import { UserController } from "./user-controller";
import { UserService } from "./user-service";

const cacheManager = new CacheManager(config.redis.url);
const userService = new UserService(cacheManager);
export const userController = new UserController(userService);
