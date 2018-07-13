let message	= (title, url, list) => ({
   text:	'', 
   from:	"you <superscraping@gmail.com>", 
   to: "SuperScraping <superscraping@gmail.com>",
   // cc:		"else <else@your-email.com>",
   subject:	`Relatório ${title}`,
   attachment: [
   {data: `<html>Diário Oficial ${title}<p>${url}</p><p>${list}</p></html>`, alternative:true}
   ]
})
module.exports = message