import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStore } from "./context/useStore";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { CircularProgress, Box } from "@mui/material";

const App = () => {
  const { user, initializeUser } = useStore();
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    initializeUser();
    setTimeout(() => setLoading(false), 500); // Simulating initial load delay
  }, []);

  const handleAuthTransition = (callback) => {
    setTransitioning(true);
    setTimeout(() => {
      setTransitioning(false);
      callback(); // Navigate after loading screen
    }, 1500);
  };

  if (loading || transitioning) {
    return (
      <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <CircularProgress sx={{ color: "#fff" }} />
      </Box>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={!user ? <Login onAuthSuccess={handleAuthTransition} /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={<Signup onAuthSuccess={handleAuthTransition} />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;