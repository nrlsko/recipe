// external packages
const express = require('express');
const hbs = require('express-handlebars');

// routers
const index_router = require('./routers/index_router');
const recipe_router = require('./routers/recipe_router');

// init application
const app = express();

// setup using handlebars for page rendering
app.engine('handlebars', hbs());
app.set('view engine',  'handlebars');

// request logging middleware
const request_logger = (req, res, next) => {
	console.log(`incoming request for: ${req.url}`);
	next();
}

// use the logging method
app.use(request_logger);

// use the routers
app.use('/', index_router);
app.use('/recipe', recipe_router);

// start listening for calls
app.listen(8080);