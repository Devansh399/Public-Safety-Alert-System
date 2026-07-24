const axios = require("axios");

const predictIncident = async (incidentData) => {

    const response = await axios.post(
    `${process.env.ML_SERVICE_URL}/predict`,
    incidentData
);

return response.data;

};

module.exports = {
    predictIncident
};