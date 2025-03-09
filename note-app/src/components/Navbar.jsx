import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/useStore";
import api from "../utils/api";
import logo from "../assets/logo.png";

const Navbar = () => {
    const { setUser, setNotes, setTasks } = useStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
            localStorage.removeItem("user");
            sessionStorage.removeItem("user");
            setUser(null);
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <AppBar position="static" sx={navbarStyles}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 3 }}>
                    {/* Logo and App Name */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img src={logo} alt="App Logo" style={{ width: 65, height: 65, marginRight: 10 }} />
                        <Typography variant="h6" sx={logoTextStyles}>
                            Notes App
                        </Typography>
                    </Box>

                    {/* Logout Button */}
                    <Button onClick={handleLogout} sx={logoutButtonStyles}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
};


const navbarStyles = {
    background: "rgba(255, 255, 255, 0.15)", 
    backdropFilter: "blur(12px)", 
    WebkitBackdropFilter: "blur(12px)", 
    borderRadius: "12px",
    width: "95%",
    maxWidth: "1300px",
    boxShadow: "0px 5px 20px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
};


const logoTextStyles = {
    fontWeight: "bold",
    color: "#fff",
};


const logoutButtonStyles = {
    background: "linear-gradient(45deg, #ff4081, #ff80ab)", 
    color: "white",
    fontWeight: "bold",
    padding: "8px 20px",
    borderRadius: "20px",
    textTransform: "none",
    boxShadow: "0px 5px 15px rgba(255, 94, 98, 0.3)",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
        background: "linear-gradient(45deg, #ff80ab, #ff4081)",
        boxShadow: "0px 8px 20px rgba(255, 94, 98, 0.5)",
        transform: "scale(1.05)",
    },
};

export default Navbar;
