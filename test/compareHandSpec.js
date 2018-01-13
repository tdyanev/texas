var holdem = require('../src/holdem');

// TODO specify spec name
xdescribe('', () => {
  var board;

  beforeEach(() => {
    board = 'As,5s,3h,9c,Ac'.split(',');
  });

  it('trips is better than two pair', () => {
    var res = holdem.compare(['AdKd', '5d3d'], board);

    expect(res.winningHand.value).toEqual([4, 14, 13, 9]);
  });

  it('higher kicker wins', () => {
    var res = holdem.compare(['TdKd', '6d4d'], board);

    expect(res.winners().length).toEqual(1);
    expect(res.winningHand.value).toEqual([2, 14, 13, 10, 9]);
  });

  it('is tie', () => {
    var res = holdem.compare(['2d2h', '2s2c'], board);

    expect(res.isTie()).toBe(true);
    expect(res.winningHand.value).toEqual([3, 14, 2, 9]);

  });

  it('many hands tie', () => {
    board = 'Ks,Ts,Ah,Jd,Qs'.split(',');

    var res = holdem.compare(
      ['AdAc', '5d3d', '6c6s', '8c8s', '2sTh'], board);

    expect(res.winners().length).toEqual(5);
  });

});

xdescribe('range', () => {

  it('AA contains 6 combons', () => {
    var range = holdem.range(['AA']);

    expect(range).toContain('AhAs');
    expect(range).toContain('AcAs');
    expect(range).toContain('AdAs');
    expect(range).toContain('AdAh');
    expect(range.length).toEqual(6);
  });

  it('AKs contains 4 combons', () => {
    var range = holdem.range(['AKs']);

    expect(range).toContain('AhKh');
    expect(range).toContain('AcKc');
    expect(range).toContain('AsKs');
    expect(range).toContain('AdKd');
    expect(range.length).toEqual(4);
  });

  it('AKo contains 12 combons', () => {
    var range = holdem.range(['AKo']);

    expect(range).toContain('AhKs');
    expect(range).toContain('AcKd');
    expect(range).toContain('AcKs');
    expect(range).toContain('AdKs');
    expect(range.length).toEqual(12);
  });

  describe('removing cards', () => {
    it('t1', () => {
      var range = holdem.range(['AKs']);
      var reduced = holdem.reduceRange(
        range, 'Ks,7s,8h,9d'.split(','));

      expect(reduced).toContain('AcKc');
      expect(reduced).toContain('AdKd');
      expect(reduced).toContain('AhKh');
      expect(reduced).not.toContain('AsKs');
    });

  });

});

xdescribe('odds', () => {
  var loops = 5000;

  describe('dead cards', () => {
    it('reduces first range', () => {
      var board = 'As,5s,3h,9c,Ac'.split(',');
      var res = holdem.odds([
        holdem.range(['AA']),
        holdem.range(['53o']),
      ], board);

      expect(res[0].range).toEqual(['AdAh']);
    });

  });

  it('obvious winner', () => {
    var board = 'As,5s,Th,9c,Ac'.split(',');
    var res = holdem.odds([
      holdem.range(['53o']),
      holdem.range(['AA', '99']),
    ], board, loops);

    expect(res[0].victories).toEqual(0);
    expect(res[1].victories).toEqual(loops);
  });

  it('drawing dead before river', () => {
    var board = 'As,5s,Th,9c'.split(',');
    var res = holdem.odds([
      holdem.range(['53o']),
      holdem.range(['AA', '99']),
    ], board, loops);

    expect(res[0].victories).toEqual(0);
    expect(res[1].victories).toEqual(loops);
  });

  it('almost flip', () => {
    var res = holdem.odds([
      holdem.range(['KQs']),
      holdem.range(['99']),
    ], [], loops);

    console.log(res);
    expect(res[0].equity()).toBeLessThan(50);
  });

  it('similiar hands', () => {
    var res = holdem.odds([
      holdem.range(['KQs']),
      holdem.range(['KQo']),
    ], [], loops);

    expect(res[0].equity()).toBeLessThan(10);
    expect(res[1].equity()).toBeLessThan(10);
  });


});
