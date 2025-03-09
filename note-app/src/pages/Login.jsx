import { useState, useEffect } from "react";
import { Box, Button, Container, TextField, Typography, Checkbox, FormControlLabel, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/useStore";
import api from "../utils/api";

const Login = ({ onAuthSuccess }) => {
    const [formData, setFormData] = useState({ userName: "", email: "", password: "" });
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const { setUser, user } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate("/dashboard");
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await api.post("/auth/login", formData);
            const newUser = { userName: response.data.userName, email: response.data.email };
            setUser(newUser);
            localStorage.setItem("user", JSON.stringify(newUser));
            onAuthSuccess(() => navigate("/dashboard")); // Delayed transition
        } catch (error) {
            setError("Invalid credentials. Please try again.");
            setTimeout(() => setError(""), 5000);
        }
    };

    return (
        <Container>
            <form onSubmit={handleSubmit}>
                <TextField fullWidth label="Email" name="email" onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Password" name="password" type="password" onChange={handleChange} margin="normal" />
                <FormControlLabel control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />} label="Remember Me" />
                <Button fullWidth type="submit" variant="contained">Login</Button>
            </form>
        </Container>
    );
};

export default Login;