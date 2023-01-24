import express from "express";

import { healthController } from "./dependencies";

const healthRouter = express.Router();

healthRouter.get("/", healthController.run.bind(healthController));

export { healthRouter };
