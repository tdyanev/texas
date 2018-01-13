var deck = {
  suits: ['c', 'd', 'h', 's'],

  labels: 'AKQJT98765432'.split(''),

  //TODO should be elsewhere
  MAX_CARDS_ON_BOARD: 5,

  init: function() {
    var res = [];

    this.suits.forEach(suit => {
      this.labels.forEach(label => {
        res.push(label + suit);

      });

    });

    return res;
  },

};

module.exports = deck;
