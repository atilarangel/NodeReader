const axios = require("axios");
const url =
  "http://doweb.rio.rj.gov.br/apifront/portal/edicoes/ultimas_edicoes.json?subtheme=false";

//Get content from API in DOWEB
const http = () =>
  axios
    .get(url)
    .then(response => response.data)
    .then(data => {
      console.log("1 - Recebendo response.data do Diário Oficial");
      return data.itens[0];
    });

module.exports = http;
