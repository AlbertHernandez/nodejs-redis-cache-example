import { Request, Response } from "express";

import { CacheManager } from "./cache-manager";

export class HealthController {
  constructor(private readonly cacheManager: CacheManager) {}

  async run(req: Request, res: Response) {
    const isHealthyCacheManager = await this.cacheManager.isHealthy();

    res.status(200).send({
      cacheManager: isHealthyCacheManager ? "Ok" : "Error",
    });
  }
}
