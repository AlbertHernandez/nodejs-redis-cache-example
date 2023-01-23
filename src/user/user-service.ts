// import { sleep } from "./sleep";

export class UserService {
  async runExpensiveTask(userId: string) {
    console.log(`Running expensive task: ${userId}`);
    // await sleep(3000);
    console.log(`Finished expensive task: ${userId}`);
    return { userId };
  }
}
