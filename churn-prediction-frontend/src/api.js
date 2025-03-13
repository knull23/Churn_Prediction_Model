import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000"; // Ensure this matches your Flask backend

/**
 * Sends customer data to the API and returns the churn prediction.
 * @param {Object} customerData - The customer details for prediction.
 * @returns {Object} Prediction result or null on error.
 */
export const getPrediction = async (customerData) => {
    try {
        // ✅ Ensure numeric fields are correctly formatted
        const formattedData = {
            ...customerData,
            "Monthly Charge": parseFloat(customerData["Monthly Charge"]) || 0,
            "Avg Monthly GB Download": parseFloat(customerData["Avg Monthly GB Download"]) || 0,
            "Tenure in Months": parseInt(customerData["Tenure in Months"]) || 0,
            "Number of Referrals": parseInt(customerData["Number of Referrals"]) || 0,
        };

        const response = await axios.post(`${API_BASE_URL}/predict`, formattedData);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching prediction:", error.response?.data || error.message);
        return null;
    }
};

/**
 * Fetches the latest prediction from the API.
 * @returns {Object} Latest stored prediction or null if none exists.
 */
export const getLatestPrediction = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/predict`);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching latest prediction:", error.response?.data || error.message);
        return null;
    }
};


