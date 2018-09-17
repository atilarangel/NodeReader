const Datastore = require('nedb'), db = new Datastore({ filename: 'database/checkData.json', autoload: true })
//dbWrite will verify if the DO were analyze or not. If not, will write in database
const dbWrite = query =>
	new Promise((resolve, reject) =>
		db.find(query, (err, docs) => {
			if (err) return reject(err)
			if (docs && docs.length > 0) {
				return resolve(true)
			} else {
				db.insert(query, function (err, newDoc) { if (err) return })
				return resolve(false)
			}
		})
)

module.exports = dbWrite
