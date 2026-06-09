import fs from "fs/promises";
import path from "path";

export async function add(filePath: string) {
  try {
    const repoPath = path.resolve(process.cwd(), ".versiona");
    const stagingPath = path.join(repoPath, "staging");

    await fs.mkdir(stagingPath, { recursive: true });
    const fileName = path.basename(filePath);
    await fs.copyFile(filePath, path.join(stagingPath, fileName));
    console.log(`File ${fileName} added to staging area.`);
  } catch (err) {
    console.error(`Error adding file: ${filePath}`, err);
  }
}
