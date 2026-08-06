const axios = require("axios");

const predictIncident = async (incidentData) => {
  try {
    console.log("\n===== CALLING ML SERVICE =====");
    console.log("URL:", `${process.env.ML_SERVICE_URL}/predict`);
    console.log("Request:", incidentData);

    const response = await axios.post(
      `${process.env.ML_SERVICE_URL}/predict`,
      incidentData
    );

    console.log("ML Response:", response.data);
    console.log("==============================\n");

    return response.data;
  } catch (error) {
    console.log("\n===== ML SERVICE ERROR =====");

    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Response:", error.response.data);
    } else {
      console.log("Error:", error.message);
    }

    console.log("=============================\n");

    throw error;
  }
};

module.exports = {
  predictIncident,
};