const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    author:{
        type: String,
        required: true
    },
    task: {
        type: String,
        required: true
    },
    completionStatus:{
        type: Boolean,
        default: false,
        required: true,
    }
}, {timestamps: true})

const ToDo = new mongoose.model('todo', todoSchema);

module.exports = ToDo;