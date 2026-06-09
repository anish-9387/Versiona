import { Request, Response } from "express";
import mongoose from "mongoose";
import Issue from "../models/issue.model";

export const createIssue = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const repoID = req.params.repoID as string;

  try {
    const issue = new Issue({
      title,
      description,
      status: "open",
      repository: new mongoose.Types.ObjectId(repoID),
    });

    await issue.save();
    res.status(201).json({ message: "Issue created successfully", issue });
  } catch (error) {
    console.error("Error creating issue:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateIssueByID = async (req: Request, res: Response) => {
  const issueID = req.params.id;
  const { title, description, status } = req.body;

  try {
    const issue = await Issue.findById(issueID);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.title = title;
    issue.description = description;
    issue.status = status;

    await issue.save();
    res.status(200).json({ message: "Issue updated successfully", issue });
  } catch (error) {
    console.error("Error updating issue:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteIssueByID = async (req: Request, res: Response) => {
  const issueID = req.params.id;

  try {
    const issue = await Issue.findByIdAndDelete(issueID);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.status(200).json({ message: "Issue deleted successfully" });
  } catch (error) {
    console.error("Error deleting issue:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllIssues = async (req: Request, res: Response) => {
  const repoID = req.params.repoID as string;

  try {
    const issues = await Issue.find({ repository: new mongoose.Types.ObjectId(repoID) });

    res.status(200).json({ issues });
  } catch (error) {
    console.error("Error fetching all issues:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getIssueByID = async (req: Request, res: Response) => {
  const issueID = req.params.id;

  try {
    const issue = await Issue.findById(issueID);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.status(200).json({ issue });
  } catch (error) {
    console.error("Error fetching issue by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
