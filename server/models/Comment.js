const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  commentauthor: {
    username: String
  },
  thread: {
    type: String,
    ref: 'Thread'
  },
  content: String,
  votes: Number,
}, { timestamps: true });


module.exports = mongoose.model('Comment', commentSchema);