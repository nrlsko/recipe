// external packages
const express = require('express');
const router = express.Router();
const hbs = require('express-handlebars');

// GET index rendering
router.get('/', (req, res) => {
	res.render('index', {page_title: 'Home'});
});

// export router for use by app
module.exports = router;