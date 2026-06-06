const AWS = require("aws-sdk");
const dotenv = require("dotenv");

dotenv.config();

AWS.config.update({
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
const S3_BUCKET = process.env.S3_BUCKET;

module.exports = { s3, S3_BUCKET };