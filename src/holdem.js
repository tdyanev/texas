var Game = require('./game');
var deck = require('./deck');
var _ = require('lodash');

const HANDS = {
  STRAIGHT_FLUSH: 9,
  QUADS: 8,
  FULL_HOUSE: 7,
  FLUSH: 6,
  STRAIGHT: 5,
  TRIPS: 4,
  TWO_PAIR: 3,
  PAIR: 2,
  HIGH_CARD: 1,
};

function sortDesc(list) {
  return list.sort((a, b) => b - a);
}


class Comprasion {

  constructor(bestHands) {
    this.setIds(bestHands);
    this.rank = _.sortBy(bestHands, hand => -hand.intValue);
    this.winningHand = this.rank[0];
    this.bestValue = this.winningHand.intValue;
  }

  setIds(hands) {
    var i = 0;

    hands.forEach(hand => {
      hand.id = (i++);
    });
  }

  isTie() {
    return this.winners().length > 1;
  }

  winners() {
    return _.filter(this.rank, ['intValue', this.bestValue]);
  }
}

class HandStrength {
  constructor(rank, rest) {
    this.value = [rank].concat(rest);
    this.intValue = this.numeric(this.value);
    this.rank = rank;
    this.name = this.toString();
  }

  numeric(parts) {
    var res = _.map(parts,
      el => el < 10 ? '0' + el : el);
    var maxSegments = 6;

    for (let i = res.length; i < maxSegments; i++) {
      res[i] = '00';
    }

    return parseInt(res.join(''), 10);
  }

  decode(i) {
    var decoded = {
      14: 'Ace',
      13: 'King',
      12: 'Queen',
      11: 'Jack',
      10: 'Ten',
      9: 'Nine',
      8: 'Eight',
      7: 'Seven',
      6: 'Six',
      5: 'Five',
      4: 'Four',
      3: 'Three',
      2: 'Deuce',
    };

    return decoded[i] || i;
  }

  toString() {
    //TODO
    switch(this.rank) {
      case HANDS.STRAIGHT_FLUSH:
        return `${this.decode(this.value[1])}-high straight flush`;
      case HANDS.QUADS:
        return `Quads of ${this.decode(this.value[1])}s with ${this
          .decode(this.value[2])} kicker`;
      case HANDS.FLUSH:
        return `Flush: ${_.map(this.value.slice(1),
          this.decode).join(',')}-high`;

    }
  }

}


var holdem = {

  encoded: {
    A: 14,
    K: 13,
    Q: 12,
    J: 11,
    T: 10,
  },

  evaluate(hand) {
    var verifications = [

      this.isStraightFlush,
      this.isQuads,
      this.isFullHouse,
      this.isFlush,
      this.isStraight,
      this.isTrips,
      this.isTwoPair,
      this.isPair,
      this.isHighCard,

    ];

    var len = verifications.length;
    var rank, result;

    if (!this.isValid(hand)) {
      //or raise exception
      return false;
    }

    for (let i = 0; i < len; i++) {
      result = verifications[i].call(this, hand);

      if (result) {
        rank = len - i;

        break;
      }
    }

    return new HandStrength(rank, result);
  },

  /*  replace 14 with 1
  reduceAceStrength(values) {
    var res = _.map(values, _.clone);
    var aceIndex = res.indexOf(this.encoded['A']);

    if (aceIndex > -1 && res.indexOf(5) > -1) {
      res[aceIndex] = 1;
    }

    return res;
  },

  strength(rank, hand) {
    var values = this.getValues(hand),
        groups = this.groupByCount(hand),
        rest, kickers;

    switch(rank) {
      case HANDS.STRAIGHT_FLUSH:
      case HANDS.STRAIGHT:
        values = this.reduceAceStrength(values);
        rest = _.max(values);
        break;
      case HANDS.QUADS:
        rest = [groups['4'][0], groups['1'][0]];
        break;
      case HANDS.FULL_HOUSE:
        rest = [groups['3'][0], groups['2'][0]];
        break;
      case HANDS.FLUSH:
      case HANDS.HIGH_CARD:
        rest = sortDesc(values);
        break;
      case HANDS.TRIPS:
        kickers = sortDesc(groups['1']);
        rest = groups['3'].concat(kickers);
        break;
      case HANDS.TWO_PAIR:
        rest = sortDesc(groups['2']).concat(groups['1']);
        break;
      case HANDS.PAIR:
        rest = groups['2'].concat(sortDesc(groups['1']));
        break;
    }

    return new HandStrength(rank, rest);
  },
  */

  isValid(hand) {
    return hand.length === _.uniq(hand).length;
  },

  isFlush(hand) {
    var suits = _.countBy(hand, card => card.charAt(1));

    for (let prop in suits) {
      if (suits[prop] >= 5) {
        let cards = this.getValues(
          _.filter(hand, card => card.charAt(1) === prop));

        return sortDesc(cards).slice(0, 5);
      }
    }

    return false;
  },

  isStraight(hand) {
    var values = _.uniq(this.getValues(hand)), len = values.length;

    if (len < deck.MAX_CARDS_ON_BOARD) {
      return false;
    }

    let cycles = len - deck.MAX_CARDS_ON_BOARD;

    values = sortDesc(values);

    for (let i = 0; i <= cycles; i++) {
      let res = isStraight(values.slice(i, i + deck.MAX_CARDS_ON_BOARD));

      if (!!res) {
        return res;
      }
    }


    function isStraight(vals) {
      var result = _isStraight(vals);

      if (values.indexOf(holdem.encoded['A']) === -1) {
        return result;
      }

      // ace is first, remove it and set "1" in the end

      let wheel = vals.slice();

      wheel.shift();
      wheel.push(1);

      return result || _isStraight(wheel);
    }

    function _isStraight(values) {
      var len = values.length;

      for (let i = 0; i < len - 1; i++) {
        if (values[i] - values[i + 1] !== 1) {
          return false;
        }
      }

      return [values[0]];
    }

    return false;
  },

  isQuads(hand) {
    var groups = this.groupByCount(hand);

    if (groups['4']) {
      return [groups['4'][0]].concat(groups['1'][0]);
    }

    return false;
  },

  isTrips(hand) {
    var groups = this.groupByCount(hand);

    if (groups['3']) {
      return [groups['3'][0]].concat(groups['1'].slice(0, 2));
    }

    return false;
  },

  isPair(hand) {
    var groups = this.groupByCount(hand);

    if (groups['2']) {
      return [groups['2'][0]].concat(groups['1'].slice(0, 3));
    }

    return false;
  },

  isStraightFlush(hand) {
    let [flush, straight] = [this.isFlush(hand), this.isStraight(hand)];

    return (flush && straight && flush[0] === straight[0]) ? straight : false;
  },

  isFullHouse(hand) {
    var groups = this.groupByCount(hand);

    if (groups['3'] && groups['2']) {
      return [groups['3'][0], groups['2'][0]];
    }

    return false;
  },

  isHighCard(hand) {
    var groups = this.groupByCount(hand);

    if (groups['1']) {
      return groups['1'].slice(0, 5);
    }

    return false;
  },

  isTwoPair(hand) {
    var groups = this.groupByCount(hand);

    if (groups['2'] && groups[2].length > 1) {
      return groups['2'].slice(0, 2)
        .concat(groups['1'][0]);
    }

    return false;
  },

  countLabels(hand) {
    return _.countBy(this.getValues(hand));
  },

  groupByCount(hand) {
    var values = this.getValues(hand);
    var result = {};

    function count(a, list) {
      var i = 0;

      list.forEach(el => {
        if (el === a) { i++; }
      });

      return i;
    }

    _.uniq(values).forEach(value => {
      let c = count(value, values);

      result[c] = result[c] || [];
      result[c].push(value);
    });

    return _.mapValues(result, item => sortDesc(item));
  },

  compare(hands, board) {
    var bestHands = _.map(hands,
      hand => this.evaluate(
      [hand.slice(0, 2), hand.slice(2)].concat(board)));

    return new Comprasion(bestHands);
  },

  handToCards(hand) {
    return [
      hand.slice(0, 2),
      hand.slice(2),
    ];
  },

  reduceRange(hands, dead) {
    var len = dead.length;

    function hasToRemove(item) {
      for (let i = 0; i < len; i++) {
        if (item.indexOf(dead[i]) > -1) {
          return true;
        }
      }
      return false;
    }

    return _.reject(hands, hasToRemove);
  },

  odds(ranges, board=[], iterations=1) {
    var samples, result, game;
    var reducedRanges = _.map(ranges, range => {
      return {
        range: this.reduceRange(range, board),
        victories: 0,
        ties: 0,
        total: 0,
        equity: function() {
          return this.victories / this.total * 100;
        },
      };
    });

    while(iterations--) {
      samples = [];

      reducedRanges.forEach(range => {

        samples.push(_.sample(range.range));
//        samples.push(cards[0], cards[1]);
      });

      game = new Game(board, _.flatten(_.map(samples, this.handToCards)));
      game.dealAll();

      res = holdem.compare(samples, game.board);


      if (res.isTie()) {
        res.winners().forEach(winner => {
          reducedRanges[winner.id].ties++;
        });
      } else {
        reducedRanges[res.winningHand.id].victories++;
      }

      reducedRanges.forEach(range => range.total++);

    }


    return reducedRanges;
  },

  removeCards(hand, board) {
    var len = board.length;

    function hasToRemove(item) {
      for (let i = 0; i < len; i++) {
        if (item.indexOf(board[i]) > -1) {
          return true;
        }
      }
      return false;
    }

    return _.reject(hand, hasToRemove);
  },

  range(cards) {
    return _.uniq(_.flatten(cards.map(
      card => this.unpack(card)
    )));
  },

  setHigherLabelFront(card) {

    return card;
  },

  unpack(_card) {
    var card = this.setHigherLabelFront(_card);

    function pairwise(list) {
      var result = [], len = list.length, j, i;

      for (i = 0; i < len - 1; i++) {
        for (j = i + 1; j < len; j++) {
          result.push([list[i], list[j]]);
        }
      }

      return result;
    }

    function genPairs() {
      var l = deck.suits;
      var res = [];

      l.forEach(suit1 => {
        l.forEach(suit2 => {
          res.push([suit1, suit2]);
        });
      });

      return res;
    }


    if (card.length === 2) {
      // pair

      let label = card.charAt(0);

      return this.contribute(pairwise(deck.suits), label, label);
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
    let pairs = genPairs();
    let [firstLabel, secondLabel] = card.slice(0, 2);
    let collection;

    if (suited) {
      collection = _.filter(pairs, pair => pair[0] === pair[1]);
    } else {
      collection = _.filter(pairs, pair => pair[0] !== pair[1]);
    }

    return this.contribute(collection, firstLabel, secondLabel);
  },

  contribute(list, label1, label2) {
    return _.map(list, suit =>
      label1 + suit[0] + label2 + suit[1]
    );
  },

  getValues(hand) {
    return _.map(hand, card => {
      var ch = card.charAt(0);

      return this.encoded[ch] || parseInt(ch, 10);
    });
  },

};

module.exports = holdem;
