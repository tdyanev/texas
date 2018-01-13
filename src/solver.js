var holdem = require('../src/holdem');
var _ = require('lodash');

var solver = {

  compare(hands, board) {
    var evals = _.map(hands, holdem.evaluate);

    console.log(evals);
  
  },

  findBest(hand, board) {
    var cards = hand.concat(board);


  
  },

  compare(hand1, hand2) {
    var res1 = holdem.evaluate(hand1);
    var res2 = holdem.evaluate(hand2);


  
  },


};

module.exports = solver;
