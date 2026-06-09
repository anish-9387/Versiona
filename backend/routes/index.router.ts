import { Router, Request, Response } from "express";
import userRouter from "./user.router";
import repositoryRouter from "./repository.router";
import issueRouter from "./issue.router";

const indexRouter = Router();

indexRouter.use("/user", userRouter);
indexRouter.use("/repository", repositoryRouter);
indexRouter.use("/issue", issueRouter);

indexRouter.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

export default indexRouter;
