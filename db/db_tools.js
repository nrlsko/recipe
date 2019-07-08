// require sqlite3 driver
const sql_driver = require('sqlite3').verbose();

// consts within the module
const ERR_MSG = 'recipe db_tools has encountered an error: ';

module.exports = {
	// creates connection to given database
	// 
	// params: (db_loc: path to db)
	// returns: sqlite3 database obj
	connect: (db_loc) => {
		let db = new sql_driver.Database(db_loc, (e) => {
			if (e) {
				console.error(`${ERR_MSG}${e.message}`);
				return;
			} else {
				console.log('connection established!');
			}
		});
		return db;
	},

	// closes an open database connection
	//
	// params: (db: active db connection to be closed)
	// returns: void
	close: (db) => {
		db.close((e) => {
			if (e) {
				console.error(`${ERR_MSG}${e.message}`);
			} else {
				console.log('connection closed!')
			}
		});
		return;	
	}
}