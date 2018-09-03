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
let input = [
'edital',
'licitao',
'licitação',
'licitações',
'recursos',
'recurso',
'social',
'sociais',
'proposta',
'propostas',
'tcnica',
'técnica',
'eletromidia',
'eletromídia',
'eletromidia',
'mdias',
'mídias',
'experincia',
'experiência',
'evento',
'eventos',
].map(y => y.toLowerCase())

analysis()
	.then(data => {
		url = `http://doweb.rio.rj.gov.br/apifront/portal/edicoes/pdf_diario/${data.id}`;
		date = data.data
		console.log(url, date)
		return dbWrite({ name: data.data, value: data.id })
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
											acc+=`<p><p>${Object.keys(elm)}</p><p>${(Object.values(elm)[0])}</p></p>`
											return acc
										})
										server.send(message(data.tipo_edicao_nome, url, list, date), (err, message) => {
											console.log(err || message)
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
