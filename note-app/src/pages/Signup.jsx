import { useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/useStore";
import api from "../utils/api";

const Signup = () => {
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
            navigate("/dashboard");
        } catch (error) {
            console.error("Signup failed:", error);
        }
    };

    return (
        <Container sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
            <Box sx={{ p: 4, borderRadius: 2, boxShadow: 3, background: "#fff" }}>
                <Typography variant="h5" mb={2}>Sign Up</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField fullWidth label="Username" name="userName" onChange={handleChange} margin="normal" />
                    <TextField fullWidth label="Email" name="email" onChange={handleChange} margin="normal" />
                    <TextField fullWidth label="Password" name="password" type="password" onChange={handleChange} margin="normal" />
                    <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>Sign Up</Button>
                </form>
            </Box>
        </Container>
    );
};

export default Signup;