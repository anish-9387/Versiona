import fs from "fs/promises";
import path from "path";

export async function initRepo() {
  const repoPath = path.resolve(process.cwd(), ".versiona");
  const commitsPath = path.join(repoPath, "commits");

  try {
    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(commitsPath, { recursive: true });
    await fs.writeFile(
      path.join(repoPath, "config.json"),
      JSON.stringify({ bucket: "s3 bucket" })
    );
    console.log("Repository initialized successfully!");
  } catch (err) {
    console.error("Error initializing repository:", err);
  }
}
