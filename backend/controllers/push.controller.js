const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config.js");

async function push() {
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

        const params = {
          Bucket: S3_BUCKET,
          Key: s3Key,
          Body: fileContent
        };

        await s3.upload(params).promise();
      }
    }

    console.log("All commits pushed to remote repository (AWS S3) successfully.");
  } catch (err) {
    console.error("Error pushing to remote repository (AWS S3): ", err);
  }
}

module.exports = { push };