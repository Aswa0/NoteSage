import { useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/useStore";
import api from "../utils/api";

const Signup = ({ onAuthSuccess }) => {
    const [formData, setFormData] = useState({ userName: "", email: "", password: "" });
    const { setUser } = useStore();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/auth/signup", formData);
            setUser({ userName: formData.userName, email: formData.email });
            onAuthSuccess(() => navigate("/dashboard")); // Delayed transition
        } catch (error) {
            console.error("Signup failed:", error);
        }
    };

    return (
        <Container>
            <form onSubmit={handleSubmit}>
                <TextField fullWidth label="Username" name="userName" onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Email" name="email" onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Password" name="password" type="password" onChange={handleChange} margin="normal" />
                <Button fullWidth type="submit" variant="contained">Sign Up</Button>
            </form>
        </Container>
    );
};

export default Signup;