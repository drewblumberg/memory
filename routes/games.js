var colors = require('colors');
var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var _ = require('lodash');
// Colors
// bold, italic, underline, inverse, yellow, cyan,
// white, magenta, green, red, grey, blue, rainbow,
// zebra, random

/*
 * POST /games
 */

exports.create = function(req, res){
  var newGame = req.query;
  var nums = [];
  for(var i = 1; i <= req.query.squares; i++){
    nums.push(i);
    nums.push(i);
  }
  newGame.gameCards = _.shuffle(nums);

  new Game(newGame).save(function(err, game){
    console.log(game);
    res.send({_id: game._id, numCards: (game.squares * 2)});
  });
}

exports.update = function(req, res){
  Game.findById(req.params.id, function(err, game){
    res.send({cardValue: game.gameCards[req.body.currentCard]});
  });
}

exports.complete = function(req, res){
  Game.findById(req.body.id, function(err, game){
    game.finishedAt = req.body.finishedAt;
    game.gameLength = (game.finishedAt - game.createdAt)/1000;
    game.save(function(err, completedGame){
      res.send(completedGame);
    });
  });
}
