var _ = require('lodash');
var deck = require('./deck');

class Game {
  constructor(board=[], dead=[]) {
    //this.dead = dead;
    var _deck = _.shuffle(deck.init());

    this.board = board.slice();
    this.dead = dead.slice();
    this.deck = _.difference(_deck, this.board.concat(dead));
  }

  dealAll() {
    var leftToDeal = deck.MAX_CARDS_ON_BOARD - this.board.length, card;

    this.board = this.board.concat(this.deal(leftToDeal));
  }

  deal(n) {
    var list = [];

    while(n--) {
      list.push(this.deck.pop());
    }

    return list;
  }

}

module.exports = Game;
