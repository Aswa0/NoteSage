import { useState, useEffect } from "react";
import { Box, Button, Container, TextField, Typography, Checkbox, FormControlLabel, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/useStore";
import api from "../utils/api";
import logo from "../assets/logo.png";
import logo2 from "../assets/logo2.png";

const Login = ({ onAuthSuccess }) => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const { setUser, user } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate("/dashboard");
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await api.post("/auth/login", formData);
            const newUser = { userName: response.data.userName, email: response.data.email };
            setUser(newUser);
            localStorage.setItem("user", JSON.stringify(newUser));
            onAuthSuccess(() => navigate("/dashboard"));
        } catch (error) {
            setError("Invalid credentials. Try again.");
            setTimeout(() => setError(""), 5000);
        }
    };

    return (
        <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", position: "relative" }}>
            <Box sx={{ position: "absolute", top: 20, left: 30, display: "flex", alignItems: "center" }}>
                <img src={logo} alt="App Logo" style={{ width: 60, height: 60, marginRight: 10 }} />
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>NotesApp</Typography>
            </Box>
            <Container sx={{ p: 4, borderRadius: 3, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)", background: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255, 255, 255, 0.3)", width: 340 }}>
                <Typography variant="h5" mb={2} textAlign="center" sx={{ color: "#fff" }}>Login</Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField fullWidth label="Email" name="email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} margin="normal" sx={{ background: "rgba(255, 255, 255, 0.1)", borderRadius: "8px", color: "#fff" }} />
                    <TextField fullWidth label="Password" name="password" type="password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} margin="normal" sx={{ background: "rgba(255, 255, 255, 0.1)", borderRadius: "8px", color: "#fff" }} />
                    <Button fullWidth type="submit" variant="contained" sx={{ mt: 2, background: "linear-gradient(45deg, #ff4081, #ff80ab)" }}>Login</Button>
                </form>
            </Container>
            <Box sx={{ position: "absolute", bottom: 20, right: 30 }}>
                <Typography variant="h6" sx={{ color: "#fff" }}>Made by Aswa0</Typography>
            </Box>
        </Box>
    );
};

export default Login;