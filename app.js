'use strict';

var express = require('express');
var app = express();
var port = 3000;
var handlebars = require('express-handlebars');

// Default Layout and locate layouts and partials
app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  layoutsDir: 'views/layouts/',
  partialsDir: 'views/partials/'
}));

// Locate the views
app.set('views', __dirname + '/views');
// Locate the assets
app.use(express.static(__dirname + '/static'));
// Set Handlebars
app.set('view engine', 'handlebars');

// Routes
// Index Page
app.get('/', function(request, response, next) {
  response.render('index');
});

// Start
app.listen(process.env.PORT || port);
console.log('Express started on port ' + port);
