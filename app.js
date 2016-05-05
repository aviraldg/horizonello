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

// List entity definition maps field names to validation functions
var LIST_ENTITY = {
  name: function(name) {
    return name && _.isString(name) && name.length;
  },
  pos: _.isNumber
};

function isValid(entity, obj) {
  if (! _.isUndefined(obj.id) && ! _.isNumber(obj.id)) {
    return false;
  }

  return _.all(_.pairs(entity).map(function(item) {
    var name = item[0], validate = item[1];
    return validate(obj[name]);
  }));
}

function getFields(entity, obj) {
  return _.pick(obj, function(v, k) {
    return _.has(entity, k);
  });
}

function isValidList(obj) {
  return isValid(LIST_ENTITY, obj);
}

function getListFields(obj) {
  return getFields(LIST_ENTITY, obj);
}

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
    var fields = getListFields(req.body);
    if (! isValidList(fields)) {
      resp.status(400).end();
    } else {
      console.log('Create list', fields);
      resp.json(storage.upsert('list', fields));
    }
  },
  update: function(req, resp, next) {
    var fields = getListFields(req.body);
    if (! isValidList(fields)) {
      resp.status(400).end();
    } else {
      fields.id = parseInt(req.params.id);
      console.log('Update list', fields);
      resp.json(storage.upsert('list', fields));
    }
  }
}));

// Start
var port = process.env.PORT || 3000;
app.listen(port);
console.log('Express started on port ' + port);

storage.init();
