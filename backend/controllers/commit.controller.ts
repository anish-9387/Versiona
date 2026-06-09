import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function commit(message: string) {
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

    await fs.writeFile(
      path.join(commitDir, "commit.json"),
      JSON.stringify({ message, timestamp: new Date().toISOString() }, null, 2)
    );

    console.log(`Committed ${commitID} created with message: "${message}"`);
  } catch (err) {
    console.error("Error committing files: ", err);
  }
}
