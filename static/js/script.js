// Your code here!
function createList(name, pos, cards) {
  return $.ajax('/api/lists', {
    type: 'POST',
    data: {
      name: name,
      pos: pos,
      cards: cards
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
      createList('Hello', 0, ['Card 1', 'Card 2'])
        .then(function(list) {
          console.log('Created list', list);
        })
    }

    // Lists should be ordered based on their 'pos' field
    data.rows = _.sortBy(data.rows, 'pos');
    data.rows.forEach(function(list) {
      var curElem = $('<li>').text(list.name);
      if (list.cards) {
        var innerUl = $('<ul>');
        list.cards.forEach(function(card) {
          innerUl.append($('<li>').text(card));
        });
        curElem.append(innerUl);
      }
      $('#lists').append(curElem);
    });
  });
