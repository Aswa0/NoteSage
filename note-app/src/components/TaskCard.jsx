import { Card, CardContent, Typography, IconButton } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../utils/api";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URI, { withCredentials: true });

const TaskCard = ({ task }) => {
    const handleComplete = async () => {
        try {
            await api.put("/user/home/task-done", { id: task._id });
            socket.emit("taskUpdated");
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete("/user/home/delete-task", { data: { id: task._id } });
            socket.emit("taskUpdated");
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    return (
        <Card sx={{ ...glassCardStyles, opacity: task.completionStatus ? 0.7 : 1 }}>
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography 
                    variant="body1"
                    sx={{ textDecoration: task.completionStatus ? "line-through" : "none", flex: 1 }}
                >
                    {task.task}
                </Typography>
                <IconButton 
                    onClick={handleComplete} 
                    disabled={task.completionStatus} 
                    sx={{ color: task.completionStatus ? "#aaa" : "#5a67d8" }}
                >
                    <CheckCircleIcon />
                </IconButton>
                <IconButton onClick={handleDelete} sx={{ color: "#764ba2" }}>
                    <DeleteIcon />
                </IconButton>
            </CardContent>
        </Card>
    );
};


const glassCardStyles = {
    borderRadius: 3,
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    padding: "10px",
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
    transition: "opacity 0.3s ease-in-out",
};

export default TaskCard;
