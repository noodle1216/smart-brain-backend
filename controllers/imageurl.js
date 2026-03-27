//clarifai api is not free anymore
// const handleImageurl = async (req, res) => {
//   const { imageUrl } = req.body;

//   try {
//     const response = await fetch(
//       "https://api.clarifai.com/v2/models/face-detection/outputs",
//       {
//         method: "POST",
//         headers: {
//           "Accept": "application/json",
//           "Authorization": "Key 3f76fcee1f2e47e9b1c84d9643a119e1"
//         },
//         body: JSON.stringify({
//         	user_app_id: {
// 				    user_id: "clarifai",
// 				    app_id: "main"
// 				  },
//           inputs: [
//             {
//               data: {
//                 image: {
//                   url: imageUrl
//                 }
//               }
//             }
//           ]
//         })
//       }
//     );

//     const data = await response.json();
//     res.json(data);
//   } catch (err) {
//     res.status(400).json('unable to work with API');
//   }
// }

//replace it with Azure Face API
const axios = require('axios');

const handleImageurl = async (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json('no image url provided');
  }

  if (!process.env.AZURE_KEY || !process.env.AZURE_ENDPOINT) {
    return res.status(500).json('API not configured');
  }

  try {
    const response = await axios.post(
      `${process.env.AZURE_ENDPOINT}/face/v1.0/detect`,
      {
        url: imageUrl
      },
      {
        params: {
          returnFaceId: false,
          returnFaceLandmarks: false
        },
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.AZURE_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(400).json('unable to work with Azure API');
  }
};


module.exports = {
  handleImageurl: handleImageurl
};