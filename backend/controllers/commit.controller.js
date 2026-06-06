const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

async function commit(message) {
  const repoPath = path.resolve(process.cwd(), ".versiona");
  const stagingPath = path.join(repoPath, "staging");
  const commitPath = path.join(repoPath, "commits");

  try {
    const commitID = uuidv4();
    const commitDir = path.join(commitPath, commitID);
    await fs.mkdir(commitDir, { recursive: true });

    const files = await fs.readdir(stagingPath);

    for (const file of files) {
      const srcPath = path.join(stagingPath, file);
      const destPath = path.join(commitDir, file);
      await fs.copyFile(srcPath, destPath);
    }

    await fs.writeFile(path.join(commitDir, "commit.json"), JSON.stringify({ message, timestamp: new Date().toISOString() }, null, 2));

    console.log(`Committed ${commitID} created with message: "${message}"`);
  } catch (err) {
    console.error("Error committing files: ", err);
  }
}

module.exports = { commit };