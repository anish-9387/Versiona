const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init.controller.js");
const { add } = require("./controllers/add.controller.js");
const { commit } = require("./controllers/commit.controller.js");
const { push } = require("./controllers/push.controller.js");
const { pull } = require("./controllers/pull.controller.js");
const { revert } = require("./controllers/revert.controller.js");

yargs(hideBin(process.argv))
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
  }, commit)

  .command("push", "Push changes to the remote repository (AWS S3)", {}, push)

  .command("pull", "Pull changes from the remote repository (AWS S3)", {}, pull)

  .command("revert <commitID>", "Revert to a specific commit", (yargs) => {
    yargs.positional("commitID", {
      describe: "Commit ID to revert to",
      type: "string",
    });
  }, revert)

  .demandCommand(1, "You need to specify atleast one command")
  .help().argv;