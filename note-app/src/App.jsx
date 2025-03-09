import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStore } from "./context/useStore";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { CircularProgress, Box } from "@mui/material";


const App = () => {
  const { user, initializeUser } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeUser();
    setTimeout(() => setLoading(false), 500); // Simulating loading delay
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;