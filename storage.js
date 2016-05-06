'use strict';
// Storage layer of our backend service. Uses a JSON file to store records.

// NPM dependencies
var fs = require('fs');
var _ = require('underscore');

// Manage persistence using a JSON file.
// Storage file layout:
// {
//    '[kind]': {
//      'nextId': 1,
//      'rows': [{'id': 0, '[field1]': [field1 value]}]
//    }
// }
var STORE_FILE = '.tmp/storage.json';

var initialized = false;
// Current application store state is stored here
var store = null;

var init = _.once(function() {
  console.log('Initializing storage...');
  // Create file if it doesn't exist
  if (! fs.existsSync(STORE_FILE)) {
    console.log('Creating new storage file.');
    if (! fs.existsSync('.tmp')) {
      fs.mkdirSync('.tmp');
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify({}));
  }

  store = JSON.parse(fs.readFileSync(STORE_FILE, {encoding: 'utf8'}));

  console.log('Done initializing storage. Read %s entities.', _.keys(store).length);
  initialized = true;
});


function writeData() {
  console.log('Writing data to storage file.');
  fs.writeFileSync(STORE_FILE, JSON.stringify(store), {encoding: 'utf8'});
}

// Get all entities of a particular kind
// ex. getAll('list') -> [{id: 1}, {id: 2},. . .]
function getAll(kind) {
  if (! store[kind]) {
    return [];
  }
  return store[kind].rows;
}

// Get many rows of the same kind.
// ex. getMany('list', [1, 2]) -> [{id: 1}, {id: 2}]
function getMany(kind, ids) {
  if (! ids) {
    return null;
  }

  if (! _.all(ids, _.isNumber)) {
    throw new Error("Ids must be a numbers");
  }

  if (! store[kind]) {
    return [];
  }

  return _.filter(store[kind].rows, function(row) {
    return _.contains(ids, row.id);
  });
}

// Get one row with given id. If no row is found, return null.
function getOne(kind, id) {
  if (! _.isNumber(id)) {
    throw new Error("Id must be a number: " + id);
  }

  var ret = getMany(kind, [id]);
  if (ret.length > 1) {
    console.warn('Found multiple entities with same id', ret);
    return ret[0];
  } else if (ret.length === 1) {
    return ret[0];
  }
  return null;
}

// Update or create a row with given entity 'kind'.
// * If 'row' has an 'id' and there's another row 'oldRow' with the same id,
//   'oldRow' is replaced with 'row'.
// * If 'row' has no 'id' or if there's no other row with the same id, a row is
//   inserted into our data storage layer.
function upsert(kind, row) {
  if (row.id && ! _.isNumber(row.id)) {
    throw new Error('Id must be number');
  }

  var entity = store[kind];


  if (! entity) {
    console.log('Creating new kind:', kind);
    entity = store[kind] = {nextId: 0, rows: []};
  }

  var found = false;

  if (row.id) {
    entity.rows = entity.rows.map(function(innerRow) {
      if (innerRow.id === row.id) {
        found = true;
        return row;
      }
      return innerRow;
    });
  }

  if (! found) {
    if (! row.id) {
      do {
        row.id = entity.nextId++;
      } while (_.any(entity.rows, function(innerRow) {
        return innerRow.id === row.id;
      }))
    }
    entity.rows.push(row);
  }

  writeData();
  return row;
}

// Delete row with given id of given entity kind.
// Returns true if row with id is found, false otherwise.
function del(kind, id) {
  var entity = store[kind];
  if (! entity) {
    return false;
  }

  var found = false;
  entity.rows = entity.rows.filter(function(row) {
    if (id === row.id) {
      found = true;
      return false; // return false delete this record
    }
    return true;
  });

  if (found) {
    writeData();
  }

  return found;
}

init();

module.exports = {}
module.exports.getAll = getAll;
module.exports.getOne = getOne;
module.exports.getMany = getMany;
module.exports.upsert = upsert;
module.exports.del = del;
