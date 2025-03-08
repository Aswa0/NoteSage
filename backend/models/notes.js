const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    note:{
        type: String,
        required: true
    }
},{timestamps: true})

const Notes = new mongoose.model("note", notesSchema);

module.exports = Notes;