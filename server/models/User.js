const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    threads: [
        {
            type: String,
            ref: 'Thread'
        }
    ]

})

module.exports = mongoose.model('User', userSchema);
