import React, { useState } from "react";
import { getPrediction } from "./api";
import { Container, TextField, Button, Typography, Paper, CircularProgress, MenuItem, Select, FormControl, InputLabel } from "@mui/material";

function PredictionPage() {
  const [formData, setFormData] = useState({
    "Monthly Charge": "",
    "Avg Monthly GB Download": "",
    "Tenure in Months": "",
    "Number of Referrals": "",
    "Contract": "",  // Dropdown
    "Payment Method": "",  // Dropdown
    "Online Security": "",  // Dropdown
    "Premium Tech Support": "" // Dropdown
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await getPrediction(formData);
      if (result) {
        setPrediction(result);
      } else {
        setError("Failed to fetch prediction. Please try again.");
      }
    } catch (error) {
      console.error("Prediction error:", error);
      setError("An error occurred while making the prediction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component={Paper} elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
      <Typography variant="h4">Customer Churn Prediction</Typography>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

        {/* Numeric Inputs */}
        {["Monthly Charge", "Avg Monthly GB Download", "Tenure in Months", "Number of Referrals"].map((key) => (
          <TextField key={key} label={key} name={key} value={formData[key]} onChange={handleChange} required />
        ))}

        {/* Dropdown Inputs for Categorical Features */}
        <FormControl required>
          <InputLabel>Contract</InputLabel>
          <Select name="Contract" value={formData.Contract} onChange={handleChange}>
            <MenuItem value="Month-to-month">Month-to-month</MenuItem>
            <MenuItem value="One Year">One Year</MenuItem>
            <MenuItem value="Two Year">Two Year</MenuItem>
          </Select>
        </FormControl>

        <FormControl required>
          <InputLabel>Payment Method</InputLabel>
          <Select name="Payment Method" value={formData["Payment Method"]} onChange={handleChange}>
            <MenuItem value="Credit Card">Credit Card</MenuItem>
            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
            <MenuItem value="Electronic Check">Electronic Check</MenuItem>
            <MenuItem value="Mailed Check">Mailed Check</MenuItem>
          </Select>
        </FormControl>

        <FormControl required>
          <InputLabel>Online Security</InputLabel>
          <Select name="Online Security" value={formData["Online Security"]} onChange={handleChange}>
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </Select>
        </FormControl>

        <FormControl required>
          <InputLabel>Premium Tech Support</InputLabel>
          <Select name="Premium Tech Support" value={formData["Premium Tech Support"]} onChange={handleChange}>
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </Select>
        </FormControl>

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Predict Churn"}
        </Button>
      </form>

      {/* Error Message */}
      {error && (
        <Typography variant="body1" color="error" style={{ marginTop: "20px" }}>
          ❌ {error}
        </Typography>
      )}

      {/* Prediction Output */}
      {prediction && !error && (
        <Typography variant="h6" style={{ marginTop: "20px" }}>
          Prediction: {prediction.churn_prediction === 1 ? "⚠️ Churn" : "✅ No Churn"} <br />
          Probability: {prediction.churn_probability ? `${prediction.churn_probability}%` : "N/A"}
        </Typography>
      )}
    </Container>
  );
}

export default PredictionPage;
