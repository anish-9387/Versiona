import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import http from "http";
import { Server } from "socket.io";

import indexRouter from "./routes/index.router";

import { initRepo } from "./controllers/init.controller";
import { add } from "./controllers/add.controller";
import { commit } from "./controllers/commit.controller";
import { push } from "./controllers/push.controller";
import { pull } from "./controllers/pull.controller";
import { revert } from "./controllers/revert.controller";

dotenv.config();

yargs(hideBin(process.argv))
  .command("start", "Start the server", {}, startServer)

  .command("init", "Initialise a new repository", {}, initRepo)

  .command(
    "add <file>",
    "Add files to the staging area",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add",
        type: "string",
      });
    },
    (argv) => {
      add(argv.file as string);
    }
  )

  .command(
    "commit <message>",
    "Commit changes to the repository",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    (argv) => {
      commit(argv.message as string);
    }
  )

  .command("push", "Push changes to the remote repository (AWS S3)", {}, push)

  .command("pull", "Pull changes from the remote repository (AWS S3)", {}, pull)

  .command(
    "revert <commitID>",
    "Revert to a specific commit",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "Commit ID to revert to",
        type: "string",
      });
    },
    (argv) => {
      revert(argv.commitID as string);
    }
  )

  .demandCommand(1, "You need to specify atleast one command")
  .help().argv;

function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;
  const mongoURL = process.env.MONGODB_URL;

  app.use(bodyParser.json());
  app.use(express.json());

  mongoose
    .connect(mongoURL!)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });

  app.use(cors({ origin: "*" }));

  app.use("/", indexRouter);

  let user = "test";
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", (userID: string) => {
      user = userID;
      console.log("================================");
      console.log(`User ${user} connected`);
      console.log("================================");
      socket.join(user);
    });
  });

  const db = mongoose.connection;
  db.once("open", async () => {
    console.log("CRUD operations called");
  });

  httpServer.listen(port as number, () => {
    console.log(`Server is running on port ${port}`);
  });
}
