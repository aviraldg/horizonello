// Manage persistence using a JSON file.

// Storage file layout
// {
//    '[kind]': {
//      'nextId': 1,
//      'rows': [{'id': 0, '[field1]': [field1 value]}]
//    }
// }
var fs = require('fs');
var _ = require('underscore');

var STORE_FILE = '.tmp/storage.json';

var initialized = false;
var store = null;

var init = _.once(function() {
  console.log('Initializing storage...');
  // Create file if it doesn't exist
  if (! fs.existsSync(STORE_FILE)) {
    console.log('Creating new storage file.');
    fs.mkdirSync('.tmp');
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
// ex. getAll('list') -> []
function getAll(kind) {
  if (! store[kind]) {
    return [];
  }
  return store[kind].rows;
}

// Get many entities of the same kind.
// ex. getMany('list', [1, 2]) -> [{id: 1}, {id: 2}]
function getMany(kind, ids) {
  if (! store[kind]) {
    return null;
  }

  return _.filter(store[kind].rows, function(row) {
    return _.contains(ids, row.id);
  });
}

// Get one entity with given id
function getOne(kind, id) {
  var ret = getMany(kind, [id]);
  if (ret.length > 1) {
    console.warn('Found multiple entities with same id', ret);
    return ret[0];
  } else if (ret.length === 1) {
    return ret[0];
  }
  return null;
}

function upsert(kind, row) {
  var entity = store[kind];

  if (! entity) {
    console.log('Creating new kind:', kind);
    entity = store[kind] = {nextId: 0, rows: []};
  }

  var found = false;

  if (row.id) {
    entity.rows.map(function(innerRow) {
      if (innerRow.id === row.id) {
        return row;
      }
      return innerRow;
    });
  }

  if (! found) {
    if (! row.id) {
      row.id = entity.nextId++;
    }
    entity.rows.push(row);
  }

  writeData();
}

module.exports = {}
module.exports.init = init;
module.exports.getAll = getAll;
