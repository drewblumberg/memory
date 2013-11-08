$(document).ready(initialize);

function initialize(){
  $(document).foundation();
  $('#stats').hide();
  $('form#nameInput').on('submit', submitGame);

  $('#board').on('click', '.card', getCardValue);
}

function submitGame(e) {
  var url = $(this).attr('action') + '?player=' + $('input[name="player"]').val() + '&squares=' + $('input[name="squares"]').val();
  sendGenericAjaxRequest(url, {}, 'post', null, e, function(data, status, jqXHR){
    console.log(data);
    buildGameBoard(data);
  });
}


function getCardValue(e){
  var $card = $(this);
  var position = $card.data('position');
  var url = '/games/' + $('#board').data('game');
  sendGenericAjaxRequest(url, {currentCard: position}, 'post', 'put', e, function(data, status, jqXHR){
    console.log(data);
    flipCard(data, $card);
  });
}

function gameDone(){
  var url = '/games/' + $('#board').data('game') + '/done';
  sendGenericAjaxRequest(url, {finishedAt: Date.now, id: $('#board').data('game')}, 'post', 'put', null, function(data,status,jqXHR){
    console.log(data);
    addDataToStats(data);
  });
}

// ----------------------------------------------------------------------------------//

function sendGenericAjaxRequest(url, data, verb, altVerb, event, successFn){
  var options = {};
  options.url = url;
  options.type = verb;
  options.data = data;
  options.success = successFn;
  options.error = function(jqXHR, status, error){console.log(error);};

  if(altVerb) options.data._method = altVerb;
  $.ajax(options);
  if(event) event.preventDefault();
}

// ----------------------------------------------------------------------------------//

function buildGameBoard(game){
  $('#board').empty();
  $('#stats').empty().hide();
  $('#board').attr('data-game', game._id);
  for (var i=0; i<game.numCards;i++){
    $card = $('<div>');
    $card.addClass('card');
    $card.attr('data-position', i);
    $('#board').append($card);
  }
}

function flipCard(card, $card) {
  $card.append(card.cardValue);
  $card.addClass('cardClicked');
  window.setTimeout(checkCardGame, 200);
}

function checkCardGame() {
  var clickedCards = $('#board .cardClicked');

  if(clickedCards.length > 1){
    if($(clickedCards[0]).text() === $(clickedCards[1]).text()){
      $(clickedCards[0]).removeClass('card').removeClass('cardClicked').addClass('cardFound');
      $(clickedCards[1]).removeClass('card').removeClass('cardClicked').addClass('cardFound');
    }
    else {
      $(clickedCards[0]).removeClass('cardClicked').text('');
      $(clickedCards[1]).removeClass('cardClicked').text('');
    }
  }

  if ($('.cardFound').length === $('#board div').length){
    gameDone();
  }
}

function addDataToStats(game){
  $('#stats').show();
  $div = $('<div>');
  $div.text('Congratulations! It took you ' + game.gameLength + 's to complete the game.');
  $('#stats').append($div);
}




