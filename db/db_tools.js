// wrap some sqlite calls as well as create a cli with the ability to 
//  preform quick modifications to the db that would otherwise require
//  digging around with `sqlite3` directly (this will probably not work
//  outside of this project without a lot of modification)

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

// cli functionality

// get arguments from process 
let args = process.argv;

// require file system
const fs = require('fs');


// remove first arg if called using `node db_tools.js [args]`
if (args[0].indexOf('node') !== -1) {
	args.shift();
}

// run whatever based on input from args

// deletes and creates a new db file as well as creates the table in it
if (args[1] === 'reinit') {
	// throw if args will be invalid
	if (args.length !== 3) {
		console.error("usage: db_tools reinit [database name]");
		return 1;
	}

	// delete existing database file and create a new one
	let file = `${args[2]}.sqlite3`
	console.log(`deleting file: ${file}`);
	fs.unlinkSync(file);
	console.log(`creating new file: ${file}`);
	fs.openSync(file, 'w');
	fs.closeSync(1);

	// connect to the database
	let db = this.connect(file);

	// create table
	let sql = fs.readFileSync(`./sql/create_${args[2]}_table.sql`);
	db.run(sql.toString('ascii'));

	// close database
	this.close(db);

	// return!
	console.log(`${args[2]}, has successfully been reinitialized!`);
	return 0;
} 
// drops and creates the table within the database
else if (args[1] === 'cycle-table') {
	if (args.length !== 3) {
		console.error("usage: db_tools cycle-table [database name]");
		return 1;
	}

	// connect to database
	console.log('establishing connection')
	let db = this.connect(`${args[2]}.sqlite3`);

	// load sql files
	console.log('loading sql files');
	let drop_sql = fs.readFileSync(`./sql/drop_${args[2]}_table.sql`);
	let create_sql = fs.readFileSync(`./sql/create_${args[2]}_table.sql`);

	// serialize the order that things are done
	console.log('executing sql');
	db.serialize(() => {
		db.run(drop_sql.toString('ascii'))
		  .run(create_sql.toString('ascii'));
	});

	// close table
	console.log('closing connection')
	this.close(db);

	// return!
	console.log(`tables successfully cycled!`);
	return 0;
} 
// throw if the input is not valid
else {
	console.error("error: either no args were sent or args are invalid");
	return 1;
}