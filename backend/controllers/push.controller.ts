import fs from "fs/promises";
import path from "path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3, S3_BUCKET } from "../config/aws-config";

export async function push() {
  const repoPath = path.resolve(process.cwd(), ".versiona");
  const commitPath = path.join(repoPath, "commits");

  try {
    const commitDirs = await fs.readdir(commitPath);

    for (const commitID of commitDirs) {
      const commitDir = path.join(commitPath, commitID);
      const files = await fs.readdir(commitDir);

      for (const file of files) {
        const filePath = path.join(commitDir, file);
        const fileContent = await fs.readFile(filePath);
        const s3Key = `commits/${commitID}/${file}`;

        await s3.send(
          new PutObjectCommand({
            Bucket: S3_BUCKET,
            Key: s3Key,
            Body: fileContent,
          })
        );
      }
    }

    console.log("All commits pushed to remote repository (AWS S3) successfully.");
  } catch (err) {
    console.error("Error pushing to remote repository (AWS S3): ", err);
  }
}
