const axios = require('axios')
const url = "http://doweb.rio.rj.gov.br/apifront/portal/edicoes/ultimas_edicoes.json?subtheme=false"

const http = () => axios.get(url)
	.then(response => response.data)
	.then(data => {
		console.log('1 - Recebendo response.data do Diário Oficial')
		return data.itens[0]
	})
http()
module.exports = http
// console.log("Esse é o site ::", http)
