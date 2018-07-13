const pdfreader = require("pdfreader")

let rows = []
let content = []
let pdfobjects = {}
let words = []
let sent = []
/*
pdfobjects = {
    1 : 'atila rangel araujo',
    2 : 'gustavo gomes da silva',
    3 : 'jose araujo'
}
*/
let count
let count2
let find = {}
let p = 0

let validate = true
let validate_list = []


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
        // console.log('Aqui não existe::::::::::', item, index)
    } 
    // else {
    //     console.log('Aqui existe::::::::::', item, index)
    // }
}
const organizeItem = (object, index, input) => {
    if (count < input.length){
        if (object.includes(input[count])){
            let x = object.indexOf(input[count])
            let list2 = object.slice(x-500, x+500)
            if (list2.includes(input[count2])) {
                // console.log(`Na página ${index} encontramos ${input[0]} e ${input[1]} próximos em: `)
                // console.log(list2)
                let obj = {}
                obj[`Na página ${index} encontramos ${input[0]} e ${input[1]} próximos em: `] = list2
                sent.push(obj)
            } else {
                // console.log(`Na página ${index} não encontramos ${input[0]} e ${input[1]} próximos`)
                count2--
                count++
                organizeItem(object, index, input)
            }
        }
    }
}
const pdfReaderMain = (file, input) => 
    new Promise((resolve, reject) =>
        new pdfreader.PdfReader()
            .parseBuffer(file, (err, item) => {
                if (err) return 
                if (!item) {
                    input.map(item => {
                        Object.keys(pdfobjects).map((elm) => {
                            matchItem(pdfobjects, elm, item)
                        })
                    })
                    sent.push(Object.keys(pdfobjects).length >= 1 ? `${input[0]} e ${input[1]} foram achados na página ${Object.keys(pdfobjects)}` : `${input[0]} e ${input[1]} não foram encontrados juntos`)
                    Object.keys(pdfobjects).map((elm) => {
                        count = 0
                        count2 = 1
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