const fs = require('fs').promises;
const path = require('path');
const { ListObjectsV2Command, GetObjectCommand } = require("@aws-sdk/client-s3");
const { s3, S3_BUCKET } = require("../config/aws-config.js");

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function pull() {
  const repoPath = path.resolve(process.cwd(), '.versiona');
  const commitsPath = path.join(repoPath, "commits");

  try {
    const data = await s3.send(new ListObjectsV2Command({
      Bucket: S3_BUCKET,
      Prefix: "commits/"
    }));

    const objects = data.Contents || [];
    if (objects.length === 0) {
      console.log("No commits found in the remote repository (AWS S3).");
      return;
    }

    for (const obj of objects) {
      const key = obj.Key;
      const commitID = path.dirname(key).split('/').pop();
      const commitDir = path.join(commitsPath, commitID);

      await fs.mkdir(commitDir, { recursive: true });

      const fileContent = await s3.send(new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: key
      }));

      const bodyBuffer = await streamToBuffer(fileContent.Body);
      await fs.writeFile(path.join(commitDir, path.basename(key)), bodyBuffer);

      console.log(`Pulled ${key}`);
    }

    console.log("Pull operation completed successfully.");
  } catch (err) {
    console.error("Error pulling from remote repository (AWS S3):", err);
  }
}

module.exports = { pull };