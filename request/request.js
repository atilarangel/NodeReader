const axios = require("axios");
//Get a buffer from url
const request = url => {
  return axios
    .request({
      responseType: "arraybuffer",
      url: url,
      method: "get",
      headers: {
        "Content-Type": "pdf"
      }
    })
    .then(response => response.data);
};

module.exports = request;
