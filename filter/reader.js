const pdfreader = require("pdfreader")

let rows = []
let content = []
let pdfobjects = {}
let words = []
let sent = []
let count;
/*
pdfobjects = {
    1 : 'atila rangel araujo',
    2 : 'gustavo gomes da silva',
    3 : 'jose araujo'
}
*/
let find = {}
let p = 0

const organizeRows = rows => {
  return Object.keys(rows) // => array of y-positions (type: float)
    .sort((y1, y2) => parseFloat(y1) - parseFloat(y2))
    .reduce((acc, elm) => {
      return [...acc, (rows[elm] || []).join("").toLowerCase()]
    }, [])
}
const createList = (page_p, object) => {
    object[page_p - 1] = content.reduce((acc, elm) => acc += (elm), '')
    return object
}
const matchItem = (objects, index, item) => {
    if (!objects[index].includes(item)) {
        delete pdfobjects[index]
    }
}
const organizeItem = (object, index, input) => {
  if (object.includes(input[0])){
      let keyword = object.indexOf(input[0])
      let listSlice = object.slice(keyword-500, keyword+500)
      let obj = {}
      if(listSlice.length>1){
        listSlice = listSlice.replace('edital', '<b style="color: red; font-size:16px;">edital</b>')
        count = 1
        while(count<=input.length){
          listSlice = listSlice.replace(`${input[count]}`, `<b style="color: blue; font-size:16px;">${input[count]}</b>`)
          count++
        }
        obj[`Na página ${index} encontramos ${input[0]} em: `] = listSlice
        console.log(listSlice)
        sent.push(obj)
      }
  }
}
const pdfReaderMain = (file, input) =>
    new Promise((resolve, reject) =>
        new pdfreader.PdfReader()
          .parseBuffer(file, (err, item) => {
              if (err) return
              if (!item) {

                Object.keys(pdfobjects).map((elm) => {
                  matchItem(pdfobjects, elm, input[0])
                })
                sent.push(Object.keys(pdfobjects).length >= 1 ? `Edital foi achado na página ${Object.keys(pdfobjects)}` : 'Edital não foi encontrado.')
                Object.keys(pdfobjects).map((elm) => {
                    organizeItem(pdfobjects[elm], elm, input)
                })
                return resolve(sent)
              }
              if (item.page) {
                  content = organizeRows(rows)
                  pdfobjects = createList(item.page, pdfobjects)
                  p++
                  rows = []
              }
              else if (item.text) {
                  // accumulate text items into rows object, per line
                  (rows[item.y] = rows[item.y] || []).push(item.text)
              }
            })
)

module.exports = pdfReaderMain, sent
