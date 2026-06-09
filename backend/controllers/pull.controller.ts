import fs from "fs/promises";
import path from "path";
import { ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3, S3_BUCKET } from "../config/aws-config";
import type { Readable } from "stream";

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function pull() {
  const repoPath = path.resolve(process.cwd(), ".versiona");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const data = await s3.send(
      new ListObjectsV2Command({
        Bucket: S3_BUCKET,
        Prefix: "commits/",
      })
    );

    const objects = data.Contents || [];
    if (objects.length === 0) {
      console.log("No commits found in the remote repository (AWS S3).");
      return;
    }

    for (const obj of objects) {
      const key = obj.Key!;
      const commitID = path.dirname(key).split("/").pop()!;
      const commitDir = path.join(commitsPath, commitID);

      await fs.mkdir(commitDir, { recursive: true });

      const fileContent = await s3.send(
        new GetObjectCommand({
          Bucket: S3_BUCKET,
          Key: key,
        })
      );

      const bodyBuffer = await streamToBuffer(fileContent.Body as Readable);
      await fs.writeFile(path.join(commitDir, path.basename(key)), bodyBuffer);

      console.log(`Pulled ${key}`);
    }

    console.log("Pull operation completed successfully.");
  } catch (err) {
    console.error("Error pulling from remote repository (AWS S3):", err);
  }
}
