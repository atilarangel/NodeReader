let message	= (title, url, list, edicao) => ({
   text:	'',
   from:	"you <superscraping@gmail.com>",
   to: "SuperScraping <superscraping@gmail.com>",
   // cc:		"else <else@your-email.com>",
    subject: `${title} Edição ${edicao}`,
   attachment: [
   {data: `<html>${title}<p>${url}</p><p>${list}</p></html>`, alternative:true}
   ]
})
module.exports = message
