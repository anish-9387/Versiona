import fs from "fs";
import path from "path";
import { promisify } from "util";

const readDir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

export async function revert(commitID: string) {
  const repoPath = path.resolve(process.cwd(), ".versiona");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitDir = path.join(commitsPath, commitID);
    const files = await readDir(commitDir);
    const parentDir = path.resolve(repoPath, "..");

    for (const file of files) {
      const srcPath = path.join(commitDir, file);
      const destPath = path.join(parentDir, file);
      await copyFile(srcPath, destPath);
    }

    console.log(`Reverted to commit ${commitID} successfully.`);
  } catch (err) {
    console.error("Error reverting to commit:", err);
  }
}
