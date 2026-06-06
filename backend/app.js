const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

const { initRepo } = require("./controllers/init.controller.js");
const { add } = require("./controllers/add.controller.js");
const { commit } = require("./controllers/commit.controller.js");
const { push } = require("./controllers/push.controller.js");
const { pull } = require("./controllers/pull.controller.js");
const { revert } = require("./controllers/revert.controller.js");

dotenv.config();

yargs(hideBin(process.argv))
  .command("start", "Start the server", {}, startServer)

  .command("init", "Initialise a new repository", {}, initRepo)

  .command("add <file>", "Add files to the staging area", (yargs) => {
    yargs.positional("file", {
      describe: "File to add",
      type: "string"
    });
  },
  (argv) => {
    add(argv.file);
  })

  .command("commit <message>", "Commit changes to the repository", (yargs) => {
    yargs.positional("message", {
      describe: "Commit message",
      type: "string"
    });
  },
  (argv) => {
    commit(argv.message);
  })

  .command("push", "Push changes to the remote repository (AWS S3)", {}, push)

  .command("pull", "Pull changes from the remote repository (AWS S3)", {}, pull)

  .command("revert <commitID>", "Revert to a specific commit", (yargs) => {
    yargs.positional("commitID", {
      describe: "Commit ID to revert to",
      type: "string",
    });
  },
  (argv) => {
    revert(argv.commitID);
  })

  .demandCommand(1, "You need to specify atleast one command")
  .help().argv;


function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;
  const mongoURL = process.env.MONGODB_URL;

  app.use(bodyParser.json());
  app.use(express.json());

  mongoose.connect(mongoURL).then(() => {
    console.log("Connected to MongoDB");
  }).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

  app.use(cors({ origin: "*" }));

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  let user = "test";
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", (userID) => {
      user = userID;
      console.log("================================");
      console.log(`User ${user} connected`);
      console.log("================================");
      socket.join(user);
    });
  });

  const db = mongoose.connection;
  db.once("open", async() => {
    console.log("CRUD operations called");
  });

  httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}