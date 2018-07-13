const fs = require('fs')
const nedb = require('nedb')

const pdfReaderMain = require('./filter/reader')
const request = require('./request/request')
const analysis = require('./request/analysis')
const server = require('./confidence/hash')
const message = require('./mail/index')
const dbWrite = require('./database/index')

let url
let date
let input = ['edita','museu'].map(y => y.toLowerCase())

analysis()
	.then(data => {
		url = `http://doweb.rio.rj.gov.br/ler_pdf.php?page=0&edi_id=${data[0]}`
		date = data[1]
		console.log('4 - Verificando se já foi analisado')
		return dbWrite({ name: date, value: data[0] })
			.then(response => {
				if (!response) {
					console.log('NAO ACHEI ELE ENTAO VOU MANDAR O RELATORIO')
					return request(url)
						.then(file => {
							console.log(`5 - Enviando Diário Oficial do dia ${date} para analise`)
							return pdfReaderMain(file, input)
								.then(list=>{
									console.log(`6 - Recebendo resultado de pdfReaderMain`)
									if (list.length > 1) {
										list = list.reduce((acc, elm)=>{
											acc+=`<p><p>${Object.keys(elm)}</p><p>${Object.values(elm)}</p></p>`
											return acc
										})
										server.send(message(date, url, list), (err, message) => { 
											// console.log(err || message) 
										})
										console.log(`7 - Relatório Enviado`)
									} else {
										console.log(`7 - Relatório Finalizado`)
										console.log(list)
									}
							})
						})
				} else {
					console.log('ACHEI ELE JA')
					console.log('5 - Já foi analisado')
				}
			})
	})

// axios.get('adsadasdada')
// .then(file => pdfReaderMain(file))