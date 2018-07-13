const axios = require('axios')
const url = 'http://doweb.rio.rj.gov.br/'

const filter = data => {
	let list = []
	let x = (data.slice(data.indexOf('<option'), data.indexOf("</select>"))).split("\r\n")
	console.log('2 - Pegando Tags <option></option> e jogando em um Array. Eliminando espaços vazios e tags que tiver (Supl.)')
	x = x.filter(y => {
		if(!y.includes('(Supl.)') && y.includes('<option')){
			return true
		}
		return false
	})

	x = x[0]
	let id = x.slice(x.indexOf('"')+1, x.indexOf('">'))
	let date = x.slice(x.indexOf('>')+1, x.indexOf('</option>'))
	list.push(id, date)
	console.log(`3 - Mandando ${list[0]} ${list[1]} para index`)
	return list
	// console.log(list)
	// .reduce((acc, elm)=>{
	// 	let id = elm.slice(elm.indexOf('"')+1, elm.indexOf('">'))
	// 	let date = elm.slice(elm.indexOf('>')+1, elm.indexOf('</option>'))
	// 	console.log(id, date)
	// })
	// console.log(x)
}

const http = () => axios.get(url)
	.then(response => response.data)
	.then(data => {
		console.log('1 - Recebendo response.data do Diário Oficial')
		return filter(data)
	})

module.exports = http
// console.log("Esse é o site ::", http)