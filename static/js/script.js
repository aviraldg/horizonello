// Your code here!
function createList(name, pos) {
  return $.ajax('/api/lists', {
    type: 'POST',
    data: {
      name: name,
      pos: pos
    }
  });
}

function loadLists() {
  return $.ajax('/api/lists');
}

loadLists()
  .then(function(data) {
    console.log('Lists', data.rows);
    if (! data.rows.length) {
      console.log('No lists found, creating one.');
      createList('Hello', 0)
        .then(function(list) {
          console.log('Created list', list);
        })
    }

    data.rows.forEach(function(list) {
      $('#lists').append($('<li>').text(list.name));
    });
  });
