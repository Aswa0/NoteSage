import { useState, useEffect } from "react";
import { Box, Button, Container, TextField, Typography, Checkbox, FormControlLabel, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/useStore";
import api from "../utils/api";
import logo from "../assets/logo.png";
import logo2 from "../assets/logo2.png";

const Login = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({ userName: "", email: "", password: "" });
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const { setUser, user } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user"));
        if (storedUser) setUser(storedUser);
    }, []);

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
            const endpoint = isSignup ? "/auth/signup" : "/auth/login";
            const response = await api.post(endpoint, formData);

            console.log("API Response:", response.data);
            const newUser = { userName: response.data.userName, email: response.data.email };

            setUser(newUser);
            localStorage.setItem("user", JSON.stringify(newUser));
            navigate("/dashboard");
        } catch (error) {
            console.error("Login failed:", error);
            setError(error.response?.status === 409 ? "Email or username already exists." : "An error occurred. Try again.");
            setTimeout(() => setError(""), 5000);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                height: "100vh",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                position: "relative",
            }}
        >
            <Box sx={{ position: "absolute", top: 20, left: 30, display: "flex", alignItems: "center" }}>
                <img src={logo} alt="App Logo" style={{ width: 60, height: 60, marginRight: 10 }} />
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
                    NotesApp
                </Typography>
            </Box>
            <Container
                sx={{
                    p: 4,
                    borderRadius: 3,
                    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    width: 340,
                    height: isSignup ? (error ? "490px" : "430px") : (error ? "480px" : "400px"),
                    transition: "all 0.3s ease-in-out",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
            >
                <Typography variant="h5" mb={2} textAlign="center" sx={{ color: "#fff" }}>
                    {isSignup ? "Sign Up" : "Login"}
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <TextField fullWidth label="Username" name="userName" onChange={handleChange} margin="normal" sx={inputStyles} />
                    )}
                    <TextField fullWidth label="Email" name="email" onChange={handleChange} margin="normal" sx={inputStyles} />
                    <TextField fullWidth label="Password" name="password" type="password" onChange={handleChange} margin="normal" sx={inputStyles} />
                    {!isSignup && (
                        <FormControlLabel
                            control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} sx={{ color: "#fff" }} />}
                            label="Remember Me"
                            sx={{ mt: 1, color: "#fff" }}
                        />
                    )}
                    <Button fullWidth type="submit" variant="contained" sx={buttonStyles}>
                        {isSignup ? "Sign Up" : "Login"}
                    </Button>
                </form>
                <Typography variant="body2" sx={{ mt: 2, textAlign: "center", cursor: "pointer", color: "#fff" }} onClick={() => setIsSignup(!isSignup)}>
                    {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                </Typography>
            </Container>
            <Box sx={{ position: "absolute", bottom: 20, right: 30, display: "flex", alignItems: "center" }}>
                <img src={logo2} alt="App Logo" style={{ width: 40, height: 40, marginRight: 10 }} />
                <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#fff", cursor: "pointer", textDecoration: "none" }}
                    component="a"
                    href={import.meta.env.VITE_GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Aswa0
                </Typography>
            </Box>
        </Box>
    );
};

const inputStyles = {
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    color: "#fff",
    "& .MuiInputBase-input": {
        color: "#fff",
        padding: "12px 14px",
    },
    "& label": {
        color: "rgba(255, 255, 255, 0.7)",
        fontSize: "1rem",
    },
    "& label.Mui-focused": {
        color: "#fff",
    },
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            borderColor: "rgba(255, 255, 255, 0.4)",
        },
        "&:hover fieldset": {
            borderColor: "#fff",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#fff",
        },
    },
};

const buttonStyles = {
    mt: 2,
    background: "linear-gradient(45deg, #ff4081, #ff80ab)",
    color: "#fff",
    fontWeight: "bold",
    py: 1.5,
    textTransform: "none",
    borderRadius: "25px",
    transition: "0.3s ease",
    "&:hover": {
        background: "linear-gradient(45deg, #ff80ab, #ff4081)",
    },
};

export default Login;
