import mongoose, { Schema, Document } from "mongoose";

export interface IRepository extends Document {
  name: string;
  description?: string;
  content: string[];
  visibility: "private" | "public";
  owner: mongoose.Types.ObjectId;
  issues: mongoose.Types.ObjectId[];
}

const repositorySchema = new Schema<IRepository>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  content: [
    {
      type: String,
    },
  ],
  visibility: {
    type: String,
    enum: ["private", "public"],
    default: "private",
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  issues: [
    {
      type: Schema.Types.ObjectId,
      ref: "Issue",
    },
  ],
});

export default mongoose.model<IRepository>("Repository", repositorySchema);
