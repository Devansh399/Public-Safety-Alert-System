// const axios = require("axios");

// const predictIncident = async (incidentData) => {

//     const response = await axios.post(
//     `${process.env.ML_SERVICE_URL}/predict`,
//     incidentData
// );

// return response.data;

// };

// module.exports = {
//     predictIncident
// }; 




//temporary
// const axios = require("axios");

// const predictIncident = async (incidentData) => {

//     try {

//         console.log("Calling ML Service...");
//         console.log(process.env.ML_SERVICE_URL);

//         const response = await axios.post(
//             `${process.env.ML_SERVICE_URL}/predict`,
//             incidentData
//         );

//         console.log("ML Response:");
//         console.log(response.data);

//         return response.data;

//     } catch (error) {

//         console.log("\n===== ML SERVICE ERROR =====");

//         if (error.response) {
//             console.log(error.response.data);
//             console.log(error.response.status);
//         } else {
//             console.log(error.message);
//         }

//         console.log("=============================\n");

//         throw error;
//     }

// };

// module.exports = {
//     predictIncident
// };


//temporarily dummy

const predictIncident = async (incidentData) => {

    console.log("Using Dummy ML Prediction...");

    return {
        detectedClass: "Road Accident",
        confidence: 0.96,
        severity: "HIGH"
    };

};

module.exports = {
    predictIncident
};