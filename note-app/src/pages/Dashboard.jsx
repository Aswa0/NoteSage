import { useEffect, useState } from "react";
import { Box, Grid, Typography, Container, Button, TextField, Card, CardContent } from "@mui/material";
import { useStore } from "../context/useStore";
import NoteCard from "../components/NoteCard";
import TaskCard from "../components/TaskCard";
import Navbar from "../components/Navbar";
import api from "../utils/api";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URI, { withCredentials: true });

const Dashboard = () => {
    const { user, notes, tasks, setNotes, setTasks } = useStore();
    const [newNote, setNewNote] = useState("");
    const [newTask, setNewTask] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get("/user/home");
                setNotes(response.data.Notes || []);
                setTasks(response.data.Tasks || []);
            } catch (error) {
                console.error("Error fetching notes & tasks:", error);
            }
        }
        fetchData();

        socket.on("taskUpdated", fetchData);
        socket.on("noteUpdated", fetchData);

        return () => {
            socket.off("taskUpdated", fetchData);
            socket.off("noteUpdated", fetchData);
        };
    }, []);

    const handleCreateNote = async () => {
        if (!newNote.trim()) return;
        try {
            const response = await api.post("/user/home/add-note", {
                userName: user.userName,
                note: newNote,
            });
            setNotes([...notes, response.data.note]);
            setNewNote("");
        } catch (error) {
            console.error("Error creating note:", error);
        }
    };

    const handleCreateTask = async () => {
        if (!newTask.trim()) return;
        try {
            const response = await api.post("/user/home/add-task", {
                userName: user.userName,
                task: newTask,
            });
            setTasks([...tasks, response.data.newTask]);
            setNewTask("");
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", p: 3 }}>
            <Navbar />
            <Container maxWidth="lg">
                <Typography variant="h4" fontWeight="bold" textAlign="center" color="#fff" mt={3} mb={4}>
                    Welcome, {user?.userName}!
                </Typography>
                <Grid container spacing={4}>
                    {/* Notes Section */}
                    <Grid item xs={12} md={6}>
                        <Box sx={glassContainerStyles}>
                            <Box sx={headerStyles}>
                                <Typography variant="h5" fontWeight="bold">Your Notes</Typography>
                                <Button sx={createButtonStyles} onClick={handleCreateNote}>+ Create Note</Button>
                            </Box>
                            <TextField fullWidth multiline minRows={3} placeholder="Write a new note..." value={newNote} onChange={(e) => setNewNote(e.target.value)} sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                {notes.length > 0 ? notes.map((note) => (
                                    <Grid item xs={12} key={note._id}>
                                        <NoteCard note={note} />
                                    </Grid>
                                )) : (
                                    <Grid item xs={12}>
                                        <Card sx={emptyCardStyles}>
                                            <CardContent>
                                                <Typography color="textSecondary">No notes found. Start writing one!</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    </Grid>

                    {/* Tasks Section */}
                    <Grid item xs={12} md={6}>
                        <Box sx={glassContainerStyles}>
                            <Box sx={headerStyles}>
                                <Typography variant="h5" fontWeight="bold">Your Tasks</Typography>
                                <Button sx={createButtonStyles} onClick={handleCreateTask}>+ Create Task</Button>
                            </Box>
                            <TextField fullWidth multiline minRows={3} placeholder="Write a new task..." value={newTask} onChange={(e) => setNewTask(e.target.value)} sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                {tasks.length > 0 ? tasks.map((task) => (
                                    <Grid item xs={12} key={task._id}>
                                        <TaskCard task={task} />
                                    </Grid>
                                )) : (
                                    <Grid item xs={12}>
                                        <Card sx={emptyCardStyles}>
                                            <CardContent>
                                                <Typography color="textSecondary">No tasks found. Add a new one!</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

// Glassmorphic Styles
const glassContainerStyles = {
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
};

const headerStyles = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 2,
};

// Stylish Create Button
const createButtonStyles = {
    background: "linear-gradient(45deg, #ff4081, #ff80ab)",
    color: "white",
    fontWeight: "bold",
    padding: "8px 16px",
    borderRadius: "8px",
    textTransform: "none",
    boxShadow: "0px 5px 15px rgba(255, 94, 98, 0.3)",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
        background: "linear-gradient(45deg, #ff80ab, #ff4081)",
        boxShadow: "0px 8px 20px rgba(255, 94, 98, 0.5)",
        transform: "scale(1.05)",
    },
};

const emptyCardStyles = {
    borderRadius: 3,
    p: 2,
    background: "rgba(255, 255, 255, 0.2)",
    textAlign: "center",
};

export default Dashboard;
