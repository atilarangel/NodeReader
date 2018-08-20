const Datastore = require('nedb'), db = new Datastore({ filename: 'database/checkData.json', autoload: true })

const dbWrite = query =>
	new Promise((resolve, reject) =>
		db.find(query, (err, docs) => {
			if (err) return reject(err)

			if (docs && docs.length > 0) {
				// console.log("ACHEI DENTRO DE DB")
				return resolve(true)
			} else {
				// console.log('NAO ACHEI DENTRO DE DB')
				// db.insert(query, function (err, newDoc) { if (err) return })
				return resolve(false)
			}
		})
)

module.exports = dbWrite
