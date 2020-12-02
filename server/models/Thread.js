const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const threadSchema = new Schema({
    _id: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
    },
    summary: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    tags: {
        type: String,
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    totalpoints: {
        type: Number,
        default: 0
    },
    userspoints: {
        type: Map,
        of: Number,
        default: {
            "dummy": 0
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},
    { timestamps: true }
)

module.exports = mongoose.model('Thread', threadSchema);
