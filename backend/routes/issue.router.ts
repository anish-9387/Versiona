import { Router } from "express";
import * as issueController from "../controllers/issue.controller";

const issueRouter = Router();

issueRouter.post("/create/:repoID", issueController.createIssue);
issueRouter.get("/all/:repoID", issueController.getAllIssues);
issueRouter.get("/:id", issueController.getIssueByID);
issueRouter.put("/:id", issueController.updateIssueByID);
issueRouter.delete("/:id", issueController.deleteIssueByID);

export default issueRouter;
