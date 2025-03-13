import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import PredictionPage from "./PredictionPage";
import DashboardPage from "./DashboardPage";
import { Container, Button, AppBar, Toolbar, Typography } from "@mui/material";

function App() {
  return (
    <Router>
      <Container>
        {/* Navigation Bar */}
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Churn Prediction App
            </Typography>
            <Button color="inherit" component={Link} to="/">
              Prediction
            </Button>
            <Button color="inherit" component={Link} to="/dashboard">
              Dashboard
            </Button>
          </Toolbar>
        </AppBar>

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<PredictionPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
