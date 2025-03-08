import { Card, CardContent, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../utils/api";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URI, { withCredentials: true });

const NoteCard = ({ note }) => {
    const handleDelete = async () => {
        try {
            await api.delete("/user/home/delete-note", { data: { id: note._id } });
            socket.emit("noteUpdated");
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    return (
        <Card sx={glassCardStyles}>
            <CardContent>
                <Typography variant="body1">{note.note}</Typography>
                <IconButton onClick={handleDelete} sx={{ float: "right", color: "#764ba2" }}>
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
    p: 1,
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
};

export default NoteCard;
