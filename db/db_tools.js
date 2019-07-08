// require sqlite3 driver
const sql_driver = require('sqlite3').verbose();

// consts within the module
const ERR_MSG = 'recipe db_tools has encountered an error: ';

// creates connection to given database
// 
// params: (db_loc: path to db)
// returns: sqlite3 database obj
exports.connect = (db_loc) => {
	let db = new sql_driver.Database(db_loc, (e) => {
		if (e) {
			console.error(`${ERR_MSG}${e.message}`);
			return;
		} else {
			console.log('connection established!');
		}
	});
	return db;
};

// closes an open database connection
//
// params: (db: active db connection to be closed)
// returns: void
exports.close = (db) => {
	db.close((e) => {
		if (e) {
			console.error(`${ERR_MSG}${e.message}`);
		} else {
			console.log('connection closed!')
		}
	});
	return;	
}

// get arguments from process 
let args = process.argv;

// require file system
const fs = require('fs');


// remove first arg if called using `node db_tools.js [args]`
if (args[0].indexOf('node') !== -1) {
	args.shift();
}

// switch to determine functionality
switch(args[1]) {
	case 'reinit':
		// delete existing database file and create a new one
		console.log(`deleting file: ${args[2]}`);
		fs.unlinkSync(args[2]);
		console.log(`creating new file: ${args[2]}`);
		fs.openSync(args[2], 'w');
		fs.closeSync(1);

		// connect and close connection to initialize the file
		let db = this.connect(args[2]);
		this.close(db);

		// return!
		console.log(`${args[2]}, has successfully been reinitialized!`);
		return 0;

	case 'debug':
		console.log(args);
		break;
	default:
		console.log("error: either no args were sent or args are invalid");
}