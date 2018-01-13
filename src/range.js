var _ = require('lodash');
var holdem = require('./holdem');

const SUITS = ['c', 'd', 'h', 's'];

function pairwise(list) {
  if (list.length < 2) { return []; }

  var first = list[0],
      rest  = list.slice(1),
      pairs = rest.map(function (x) { return [first, x]; });

  return pairs.concat(pairwise(rest));
}

/* not sure whether we need this class
class Hand {
  constructor(cards) {
    this.cards = cards;
  }
}
*/

class Range {

  constructor(cards=[]) {
    if (!!cards) {
      this.populate(cards);
    }
  }

  contain(hand) {
    return _.contains(this.hands, hand) ||
      _.contains(this.hands, this.inverse(hand));
  }

  inverse(hand) {
  }

  contribute(list, label1, label2) {
    return _.map(list, pair =>
      label1 + pair[0] + label2 + pair[1]
    );
  }

  populate(cards) {
    this.hands = _.uniq(_.flatten(cards.map(
      card => this.unpack(card)
    )));
  }

  unpack(card) {

    if (card.length === 2) {
      // pair

      let label = card.charAt(0);

      return this.contribute(pairwise(SUITS), label, label);
    }

    if (card.length === 4) {
      //single hand

      return [card];
    }

    if (card.length !== 3) {
      // raise exception

      return;
    }

    // AKo or AKs type of hand

    let suited = card.charAt(2) === 's';
    let [firstLabel, secondLabel] = card.slice(0, 2);

    if (suited) {

      return this.contribute(_.zip(SUITS, SUITS), firstLabel, secondLabel);

    }

    return this.contribute(pairwise(SUITS), firstLabel, secondLabel);
  }

}


module.exports = Range;
