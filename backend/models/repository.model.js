const mongoose = require('mongoose');
const { Schema } = mongoose;

const repositorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  content: [{
    type: String
  }],
  visibility: {
    type: String,
    enum: ['private', 'public'],
    default: 'private'
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  issues: [{
    type: Schema.Types.ObjectId,
    ref: 'Issue'
  }]
});

module.exports = mongoose.model('Repository', repositorySchema);