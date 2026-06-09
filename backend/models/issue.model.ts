import mongoose, { Schema, Document } from "mongoose";

export interface IIssue extends Document {
  title: string;
  description: string;
  status: "open" | "closed";
  repository: mongoose.Types.ObjectId;
}

const issueSchema = new Schema<IIssue>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
  repository: {
    type: Schema.Types.ObjectId,
    ref: "Repository",
    required: true,
  },
});

export default mongoose.model<IIssue>("Issue", issueSchema);
