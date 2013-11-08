var mongoose = require('mongoose');
var _ = require('lodash');

var Game = mongoose.Schema({
  player: String,
  squares: {type: Number, default: 8},
  gameCards: [Number],
  createdAt: {type: Date, default: Date.now},
  finishedAt: Date,
  gameLength: Number
});

mongoose.model('Game', Game);