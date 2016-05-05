'use strict';

// NPM dependencies
var express = require('express');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var _ = require('underscore');

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

var LIST_FIELDS = ['id', 'name', 'pos'];

// LISTS
app.use('/api/lists', restRouter({
  getAll: function(req, resp, next) {
    var result = storage.getAll('list');
    if (result) {
      resp.json({ rows: result });
    } else {
      resp.status(404).end();
    }
  },
  getOne: function(req, resp, next) {
    var result = storage.getOne('list', parseInt(req.params.id));
    if (result) {
      resp.json(result);
    } else {
      resp.status(404).end();
    }
  },
  create: function(req, resp, next) {
    var props = _.pick(req.body, function(k, v) {
      return _.contains(LIST_FIELDS, v);
    });

    if (! props.name || !props.name.length) {
      resp.status(400).send('Missing list property: name');
    } else {
      console.log('Create list', props);
      resp.json(storage.upsert('list', props));
    }
  },
  update: function(req, resp, next) {
    var props = _.pick(req.body, function(k, v) {
      return _.contains(LIST_FIELDS, v);
    });
    if (! props.name || !props.name.length) {
      resp.status(400).send('Missing list property: name');
    } else {
      props.id = parseInt(req.params.id);
      console.log('Update list', props);
      resp.json(storage.upsert('list', props));
    }
  }
}));

// CARDS
app.use('/api/lists', restRouter());

// Start
var port = process.env.PORT || 3000;
app.listen(port);
console.log('Express started on port ' + port);

storage.init();
