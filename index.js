const fs = require("fs");
const nedb = require("nedb");

const pdfReaderMain = require("./filter/reader");
const request = require("./request/request");
const analysis = require("./request/analysis");
const server = require("./confidence/hash");
const message = require("./mail/index");
const dbWrite = require("./database/index");

let url;
let date;
let input = [
  "edital",
  "licitao",
  "licitação",
  "licitações",
  "recursos",
  "recurso",
  "social",
  "sociais",
  "proposta",
  "propostas",
  "tcnica",
  "técnica",
  "eletromidia",
  "eletromídia",
  "eletromidia",
  "mdias",
  "mídias",
  "experincia",
  "experiência",
  "evento",
  "eventos"
].map(y => y.toLowerCase());

//Firstly, acess the web site and verify if the content exist and will take a recently date and id
analysis()
	.then(data => {
		url = `http://doweb.rio.rj.gov.br/apifront/portal/edicoes/pdf_diario/${data.id}`;
	date = data.data;
	//DbWrite is a database. It's will verify if the response (pdf) was analysed or not.
	return dbWrite({ name: data.data, value: data.id })
		.then(response => {
			if (!response) {
			console.log("NAO ACHEI ELE ENTAO VOU MANDAR O RELATORIO");
			//Request will acess url and take the pdf (will be a buffer).
			return request(url).then(file => {
				console.log(`5 - Enviando Diário Oficial do dia ${date} para analise`);
				/*
					Now, Here begins the joke. PdfReaderMain will take a buffer (file) and read it. It will filter based on our input array.
					It will return a array. Which keys will be filtered pages and your values will be a a text (paragraphy).
				*/
				return pdfReaderMain(file, input).then(list => {
				console.log(`6 - Recebendo resultado de pdfReaderMain`);
				//So, We will analyze if the array has something. If bigger than 1, will sent a message to email.
				if (list.length > 1) {
					list = list.reduce((acc, elm) => {
					acc += `<p><p>${Object.keys(elm)}</p><p>${Object.values(elm)[0]}</p></p>`;
					return acc;
					});
					server
					.send(
						message(data.tipo_edicao_nome, url, list, date),
						(err, message) => {
							console.log(err || message);
						}
					);
					console.log(`7 - Relatório Enviado`);
				} else {
					console.log(`7 - Relatório Finalizado`);
					console.log(list);
				}
				});
			});
			} else {
			console.log("5 - Já foi analisado");
			}
		});
	});
