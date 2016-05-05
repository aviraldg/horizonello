'use strict';

// NPM dependencies
var express = require('express');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');

// Local dependencies
var storage = require('./storage');

var app = express();
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

// Add POST request parsing for message bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
// Index Page
app.get('/', function(request, response, next) {
  response.render('index');
});


// A set of routes for a RESTful entity
var restRouter = function(opts) {
  opts = opts || {};

  var ret = express.Router();
  // Get all
  if (opts.getAll) {
    ret.get('/', opts.getAll);
  }
  // Get one
  if (opts.getOne) {
    ret.get('/:id', opts.getOne);
  }
  // Create
  if (opts.create) {
    ret.post('/', opts.create);
  }
  // Create
  if (opts.update) {
    ret.post('/:id', opts.update);
  }
  // Delete
  if (opts.delete) {
    ret.delete('/:id', opts.delete);
  }
  return ret;
}

// LISTS
app.use('/api/lists', restRouter({
  getOne: function(req, resp, next) {
    resp.json({ message: 'hooray! welcome to our api!' });
  },
  getOne: function(req, resp, next) {
    resp.json({ message: 'hooray! welcome to our api!' });
  }
}));

// CARDS
app.use('/api/lists', restRouter());

// Start
var port = process.env.PORT || 3000;
app.listen(port);
console.log('Express started on port ' + port);

storage.init();
