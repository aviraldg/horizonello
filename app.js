'use strict';

// NPM dependencies
var express = require('express');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var _ = require('underscore');

// Local dependencies
var storage = require('./storage');

var app = express();

// Locate layouts and partials
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
app.use(bodyParser.json())

// Index Page
app.get('/', function(request, response, next) {
  response.render('index');
});

// Entity functions
function isValid(entity, obj) {
  if (! _.isUndefined(obj.id) && ! _.isFinite(obj.id)) {
    console.log('Id validation failed', obj.id);
    return false;
  }

  return _.all(_.pairs(entity).map(function(item) {
    var name = item[0], validate = item[1];
    var ret = validate(obj[name]);
    if (! ret) {
      console.log('Validation failed for field %s, value: %s', name, obj[name]);
    }
    return ret;
  }));
}

function getFields(entity, obj) {
  return _.pick(obj, function(v, k) {
    return _.has(entity, k);
  });
}

// REST Endpoint: /api/list
// CRUD actions for list
var listApiRouter = express.Router();
app.use('/api/lists', listApiRouter);

// LIST_FIELDS: names of valid entity fields mapped to functions for validating
// contents of fields.
var LIST_FIELDS = {
  name: function(name) {
    return name && _.isString(name) && name.length;
  },
  pos: _.isNumber,
  cards: function(cards) {
    return ! cards || (_.isArray(cards) && _.all(cards, _.isString));
  }
};

// GET /api/lists Get all lists
listApiRouter.get('/', function(req, resp, next) {
  var result = storage.getAll('list');
  if (result) {
    resp.json({ rows: result });
  } else {
    resp.status(404).end();
  }
});

// GET /api/lists/:id Get one list
listApiRouter.get('/:id', function(req, resp, next) {
    var result = storage.getOne('list', parseInt(req.params.id));
    if (result) {
      resp.json(result);
    } else {
      resp.status(404).end();
    }
});

// POST /api/lists create new list
listApiRouter.post('/', function(req, resp, next) {
  var fields = getFields(LIST_FIELDS, req.body);
  fields.pos = parseInt(fields.pos);
  if (! isValid(LIST_FIELDS, fields)) {
    resp.status(400).end();
  } else {
    console.log('Create list', fields);
    resp.json(storage.upsert('list', fields));
  }
});

// POST /api/lists/:id Update existsing list
listApiRouter.post('/:id', function(req, resp, next) {
  var fields = getFields(LIST_FIELDS, req.body);
  fields.pos = parseInt(fields.pos);
  if (! isValid(LIST_FIELDS, fields)) {
    resp.status(400).end();
  } else {
    fields.id = parseInt(req.params.id);
    console.log('Update list', fields);
    resp.json(storage.upsert('list', fields));
  }
});

// Start
var port = process.env.PORT || 3000;
app.listen(port);
console.log('Express started on port ' + port);

storage.init();
