var Game = require('../src/game');

xdescribe('Game', () => {
  var game;


  it('has full deck', () => {
    game = new Game();

    expect(game.deck.length).toEqual(52);
  });

  it('nothing to do', () => {
    var board = 'As,5s,Th,9c,Ac'.split(',');

    game = new Game(board);
    game.dealAll();

    expect(game.board).toEqual(board);
  });

  it('has one dead card', () => {
    var dead = 'Kc';

    game = new Game([], [dead]);

    expect(game.deck.length).toEqual(51);
    expect(game.deck).not.toContain(dead);
  });

  it('board card are also dead', () => {
    var dead = 'Kc';

    game = new Game(['Kd', 'Kh', 'Ks'], [dead]);

    expect(game.deck.length).toEqual(48);
    expect(game.deck).not.toContain(dead);
  });

  it('completes many iterations board', () => {
    var i = 10e2;
    var dead = 'Kc';

    while(i--) {
      game = new Game([], [dead]);
      game.dealAll();

      expect(game.board).not.toContain(dead);
    }
  });

  it('completes board', () => {
    var dead = 'Kc';

    game = new Game(['Kd', 'Kh', 'Ks'], [dead]);
    game.dealAll();

    expect(game.board.length).toEqual(5);
    expect(game.deck.length).toEqual(46);
    expect(game.board).not.toContain('Kc');
  });
});
