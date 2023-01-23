import { Request, Response } from "express";

import { UserService } from "./user-service";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async run(req: Request, res: Response) {
    const userId = req.params.id;
    const response = await this.userService.runExpensiveTask(userId);
    res.status(200).send(response);
  }
}
