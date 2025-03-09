const express = require("express");
const { ToDo, Notes, User } = require("../models/index");
const authMiddleware = require("../middleware/authMiddleware");

const userRouter = express.Router();
userRouter.use(express.json());

userRouter.use("/home", authMiddleware);

userRouter.get("/home", async (req, res) => {
    try {
        const { userName, email } = req.user;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "No User Found" });
        }

        const notes = await Notes.find({ author: userName });
        const tasks = await ToDo.find({ author: userName });

        return res.status(200).json({
            message: `Hello, ${userName}!`,
            userName,
            email,
            Notes: notes,
            Tasks: tasks
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
});

userRouter.post("/home/add-note", async (req, res) => {
    try {
        const { userName, note } = req.body;
        const noteUpload = await Notes.create({ author: userName, note });

        if (noteUpload) {
            console.log("Note Added");
            req.app.get("io").emit("noteUpdated"); 
            return res.status(200).json({ message: "Note Added", note: noteUpload });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
});

userRouter.post("/home/add-task", async (req, res) => {
    try {
        const { userName, task } = req.body;
        const newTask = await ToDo.create({ author: userName, task, completionStatus: false });

        if (!newTask) {
            return res.status(400).json({ message: "Add Failed" });
        }

        req.app.get("io").emit("taskUpdated"); 

        res.status(200).json({ message: "Task added successfully", newTask });
    } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

userRouter.put("/home/task-done", async (req, res) => {
    try {
        const { id } = req.body;
        const update = await ToDo.updateOne({ _id: id }, { $set: { completionStatus: true } });

        if (update.modifiedCount === 0) {
            console.log("Update Failed");
            return res.status(400).json({ message: "Update Failed" });
        }

        req.app.get("io").emit("taskUpdated"); 
        console.log("Update Done");
        return res.status(200).json({ message: "Update Done" });
    } catch (error) {
        console.log(error);
    }
});

userRouter.delete("/home/delete-task", async (req, res) => {
    try {
        const { id } = req.body;
        const deleted = await ToDo.deleteOne({ _id: id });

        if (deleted.deletedCount === 0) {
            console.log("Deletion Failed");
            return res.status(400).json({ message: "Deletion Failed" });
        }

        req.app.get("io").emit("taskUpdated"); 
        console.log("Deletion Done");
        return res.status(200).json({ message: "Deletion Done" });
    } catch (error) {
        console.log(error);
    }
});

userRouter.delete("/home/delete-note", async (req, res) => {
    try {
        const { id, userName } = req.body;
        const deletedNote = await Notes.findOneAndDelete({ _id: id });

        req.app.get("io").emit("noteUpdated");
        console.log("Note Deleted");
        return res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports = userRouter;
