import React, { useState, useEffect } from "react";
import { getLatestPrediction } from "./api";
import { Button, Typography, Container, Paper, CircularProgress, Tooltip } from "@mui/material";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip as ChartTooltip,
  Legend,
  LineElement,
  PointElement,
  Title
} from "chart.js";

// ✅ Register Required Chart.js Components
ChartJS.register(
  ArcElement, // Required for Pie Chart
  BarElement,
  CategoryScale,
  LinearScale,
  ChartTooltip,
  Legend,
  LineElement,
  PointElement,
  Title
);

function DashboardPage() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [zoomedChart, setZoomedChart] = useState(null); // Track which chart is zoomed

  const fetchPrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getLatestPrediction();
      if (result) {
        setPrediction(result);
      } else {
        setError("No predictions found. Please make a prediction first.");
      }
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setError("An error occurred while fetching the prediction.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, []);

  // ✅ Toggle Zoom on Chart Click
  const handleChartClick = (chartId) => {
    setZoomedChart((prevZoom) => (prevZoom === chartId ? null : chartId));
  };

  return (
    <Container>
      <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
        <Typography variant="h4" align="center">📊 Churn Prediction Dashboard</Typography>

        <Button variant="contained" color="primary" onClick={fetchPrediction} fullWidth disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "🔄 Get Latest Prediction"}
        </Button>

        {error && (
          <Typography variant="body1" color="error" style={{ marginTop: 20 }}>
            ❌ {error}
          </Typography>
        )}

        {prediction && !error && (
          <>
            {/* 📢 Prediction Output */}
            <Typography variant="h6" style={{ marginTop: 20 }}>
              Prediction: {prediction.churn_prediction === 1 ? "⚠️ Churn" : "✅ No Churn"}
            </Typography>
            <Typography variant="h6">
              Probability: {prediction.churn_probability ? `${prediction.churn_probability}%` : "N/A"}
            </Typography>

            {/* 🟢 Churn Distribution Pie Chart */}
            <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
              <Typography variant="h6" align="center">🛑 Churn vs. No Churn Distribution</Typography>
              <Tooltip title="Click to zoom" arrow>
                <div
                  style={{
                    maxWidth: zoomedChart === "churnPie" ? "100%" : "500px",
                    maxHeight: zoomedChart === "churnPie" ? "100%" : "300px",
                    margin: "auto",
                    cursor: "pointer"
                  }}
                  onClick={() => handleChartClick("churnPie")}
                >
                  <Pie
                    data={{
                      labels: ["No Churn", "Churn"],
                      datasets: [{ data: [100 - prediction.churn_probability, prediction.churn_probability], backgroundColor: ["#4caf50", "#f44336"] }],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </Tooltip>
            </Paper>

            {/* 📈 Churn Over Tenure (Line Chart) */}
            <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
              <Typography variant="h6" align="center">📉 Churn Over Tenure</Typography>
              <Tooltip title="Click to zoom" arrow>
                <div
                  style={{
                    maxWidth: zoomedChart === "tenureChart" ? "100%" : "500px",
                    maxHeight: zoomedChart === "tenureChart" ? "100%" : "300px",
                    margin: "auto",
                    cursor: "pointer"
                  }}
                  onClick={() => handleChartClick("tenureChart")}
                >
                  <Line
                    data={{
                      labels: ["0-12", "12-24", "24-48", "48-60", "60+"],
                      datasets: [{ label: "Churn Rate (%)", data: [20, 35, 50, 45, 30], backgroundColor: "rgba(255, 99, 132, 0.5)", borderColor: "rgba(255, 99, 132, 1)", borderWidth: 2, fill: true }],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </Tooltip>
            </Paper>

            {/* 📊 Monthly Charge vs. Churn Probability */}
            <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
              <Typography variant="h6" align="center">💰 Monthly Charge vs. Churn Probability</Typography>
              <Tooltip title="Click to zoom" arrow>
                <div
                  style={{
                    maxWidth: zoomedChart === "monthlyCharge" ? "100%" : "500px",
                    maxHeight: zoomedChart === "monthlyCharge" ? "100%" : "300px",
                    margin: "auto",
                    cursor: "pointer"
                  }}
                  onClick={() => handleChartClick("monthlyCharge")}
                >
                  <Bar
                    data={{
                      labels: ["Low", "Medium", "High"],
                      datasets: [{ label: "Churn Probability (%)", data: [25, prediction.churn_probability, 75], backgroundColor: ["#ffeb3b", "#ff9800", "#f44336"] }],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </Tooltip>
            </Paper>

            {/* 📊 Contract Type vs. Churn Rate */}
            <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
              <Typography variant="h6" align="center">📜 Contract Type vs. Churn Rate</Typography>
              <Tooltip title="Click to zoom" arrow>
                <div
                  style={{
                    maxWidth: zoomedChart === "contractChart" ? "100%" : "500px",
                    maxHeight: zoomedChart === "contractChart" ? "100%" : "300px",
                    margin: "auto",
                    cursor: "pointer"
                  }}
                  onClick={() => handleChartClick("contractChart")}
                >
                  <Bar
                    data={{
                      labels: ["Month-to-Month", "One Year", "Two Year"],
                      datasets: [{ label: "Churn Rate (%)", data: [60, 30, 10], backgroundColor: ["#f44336", "#ff9800", "#4caf50"] }],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </Tooltip>
            </Paper>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default DashboardPage;




