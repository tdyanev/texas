var holdem = require('../src/holdem');

describe('Evaluates', () => {

  it('invalid hand', () => {
    var hand = 'Kd,Ks,Kd,Js,Qc'.split(',');

    expect(holdem.isValid(hand)).toBe(false);

    hand[0] = '2s';

    expect(holdem.isValid(hand)).toBe(true);
  });

  it('values', () => {
    var hand = 'Ad,Qs,8d,Ts,9c'.split(',');

    expect(holdem.getValues(hand)).toEqual([
      14, 12, 8, 10, 9
    ]);

  });

  it('quads', () => {
    var hand = 'Ad,As,Ac,Ah,9c,9s,Jh'.split(',');

    expect(holdem.isQuads(hand)).toEqual([14,11]);
  });

  it('trips', () => {
    var hand = 'Kd,8s,Ad,As,Ac,Qh,9c'.split(',');

    expect(holdem.isTrips(hand)).toEqual([14,13,12]);
  });

  it('two pair', () => {
    var hand = 'Ad,As,8c,8h,9c,Kh,Qs'.split(',');

    expect(holdem.isTwoPair(hand)).toEqual([14,8,13]);
  });

  it('pair', () => {
    var hand = 'Kd,As,8c,8h,9c,2s,3d'.split(',');

    expect(holdem.isPair(hand)).toEqual([8,14,13,9]);
  });

  it('pair', () => {
    var hand = 'As,5c,Kc,5d,2h'.split(',');

    expect(holdem.isPair(hand)).toEqual([5,14,13,2]);
  });

  it('high card', () => {
    var hand = 'Kd,As,8c,2h,7c,3s,9c'.split(',');

    expect(holdem.isHighCard(hand)).toEqual([14,13,9,8,7]);
  });

  it('full house', () => {
    var hand = 'Kd,Ks,5d,8d,8h,8c,Ad'.split(',');

    expect(holdem.isFullHouse(hand)).toEqual([8,13]);
  });

  it('flush', () => {
    var hand = 'Ks,Ts,8s,Tc,2s,Js,Qs'.split(',');

    expect(holdem.isFlush(hand)).toEqual([13,12,11,10,8]);

    hand[0] = 'Th';
    hand[1] = 'Qh';

    expect(holdem.isFlush(hand)).toBe(false);
  });

  it('straight', () => {
    var hand = 'Ks,Ts,2s,2c,9s,Jd,Qc'.split(',');

    expect(holdem.isStraight(hand)).toEqual([13]);

    hand[0] = 'Th';

    expect(holdem.isStraight(hand)).toBe(false);
  });

  it('wheel straight', () => {
    var hand = 'As,2s,5s,8h,9d,3d,4c'.split(',');

    expect(holdem.isStraight(hand)).toEqual([5]);
  });

  it('straight flush', () => {
    var hand = 'Ks,Ts,3d,Th,9s,Js,Qs'.split(',');

    expect(holdem.isStraightFlush(hand)).toEqual([13]);
  });

  it('fake straight flush', () => {
    var hand = '8s,Td,7c,3c,6c,9c,8c'.split(',');

    expect(holdem.isStraightFlush(hand)).toEqual(false);
  });

});

xdescribe('Hand', () => {

  describe('5 cards hand', () => {
    it('straight flush has correct value', () => {
      var hand = 'Ks,Ts,9s,Js,Qs'.split(',');
      var handStr = holdem.evaluate(hand);

      expect(handStr.value).toEqual([9, 13]);
    });

    it('quads', () => {
      var hand = 'Ks,Kc,Kh,Kd,Qs'.split(',');
      var handStr = holdem.evaluate(hand);

      expect(handStr.value).toEqual([8, 13, 12]);
    });

    it('full house', () => {
      var hand = 'Ks,Qc,Qh,Kd,Qs'.split(',');
      var handStr = holdem.evaluate(hand);

      expect(handStr.value).toEqual([7, 12, 13]);
    });

    it('full house', () => {
      var hand = 'Ks,Kc,Qh,Kd,Qs'.split(',');
      var handStr = holdem.evaluate(hand);

      expect(handStr.value).toEqual([7, 13, 12]);
    });

    it('flush', () => {
      var hand = 'Ks,Ts,Qs,5s,8s'.split(',');
      var handStr = holdem.evaluate(hand);

      expect(handStr.value).toEqual(
        [6, 13, 12, 10, 8, 5]);
    });

    it('flush but also straight', () => {
      var hand = '7s,Ts,6s,9s,8s'.split(',');
      var handStr = holdem.evaluate(hand);

      expect(handStr.value).not.toEqual(
        [6, 10, 9, 8, 7, 6]);

      expect(handStr.value).toEqual(
        [9, 10]);
    });

    it('regular straight has correct value', () => {
      var hand = 'Ks,Qs,Jc,Ts,Ah'.split(',');
      var handStr = holdem.evaluate(hand);

      expect(handStr.value).toEqual([5, 14]);
    });

    it('wheel straight has correct value', () => {
      var hand = '5s,4s,Ac,3s,2h'.split(',');
      var handStr = holdem.evaluate(hand);

      expect(handStr.value).toEqual([5, 5]);
      expect(handStr.intValue).toEqual(50500000000);
    });

    it('trips', () => {
      var hand = '5s,5c,Ac,5d,2h'.split(',');
      var handStr = holdem.evaluate(hand);

      expect(handStr.value).toEqual([4, 5, 14, 2]);
    });

    it('two pair', () => {
      var hand = 'As,5c,Ac,5d,2h'.split(',');
      var handStr = holdem.evaluate(hand);

      expect(handStr.value).toEqual([3, 14, 5, 2]);
    });

    it('pair', () => {
      var hand = 'As,5c,Kc,5d,2h'.split(',');
      var handStr = holdem.evaluate(hand);

      expect(handStr.value).toEqual([2, 5, 14, 13, 2]);
    });

    it('high card', () => {
      var hand = 'As,5c,8c,9d,2h'.split(',');
      var handStr = holdem.evaluate(hand);

      expect(handStr.value).toEqual([1, 14, 9, 8, 5, 2]);
      expect(handStr.intValue).toEqual(11409080502);
    });
  });

  describe('6+ cards hand', () => {
    it('straight flush has correct value', () => {
      var hand = '2c,Th,Ks,Ts,9s,Js,Qs'.split(',');
      var handStr = holdem.evaluate(hand);

      expect(handStr.value).toEqual([9, 13]);
    });

    it('quads', () => {
      var hand = 'Ks,3d,3h,Kc,Kh,Kd,Qs'.split(',');
      var handStr = holdem.evaluate(hand);

      expect(handStr.value).toEqual([8, 13, 12]);
    });

    it('full house', () => {
      var hand = 'Ks,Qc,Th,9c,Qh,Kd,Qs'.split(',');
      var handStr = holdem.evaluate(hand);

      expect(handStr.value).toEqual([7, 12, 13]);
    });

    it('full house', () => {
      var hand = 'Ks,Kc,Th,Qh,Kd,Qs,Td'.split(',');
      var handStr = holdem.evaluate(hand);

      expect(handStr.value).toEqual([7, 13, 12]);
    });

    it('flush', () => {
      var hand = 'Ks,3d,3c,Ts,Qs,5s,8s'.split(',');
      var handStr = holdem.evaluate(hand);

      expect(handStr.value).toEqual(
        [6, 13, 12, 10, 8, 5]);
    });

    it('flush but also straight', () => {
      var hand = '7s,5d,5s,Ts,6s,9s,8s'.split(',');
      var handStr = holdem.evaluate(hand);

      expect(handStr.value).not.toEqual(
        [6, 10, 9, 8, 7, 6]);

      expect(handStr.value).toEqual(
        [9, 10]);
    });

    it('regular straight has correct value', () => {
      var hand = '2d,9s,Ks,Qs,Jc,Ts,Ah'.split(',');
      var handStr = holdem.evaluate(hand);

      expect(handStr.value).toEqual([5, 14]);
    });

    it('wheel straight has correct value', () => {
      var hand = 'Ks,Kd,5s,4s,Ac,3s,2h'.split(',');
      var handStr = holdem.evaluate(hand);

      expect(handStr.value).toEqual([5, 5]);
      expect(handStr.intValue).toEqual(50500000000);
    });

    it('trips', () => {
      var hand = '5s,8s,Qh,5c,Ac,5d,2h'.split(',');
      var handStr = holdem.evaluate(hand);

      expect(handStr.value).toEqual([4, 5, 14, 12]);
    });

    it('two pair', () => {
      var hand = 'As,5c,Ac,Qh,Js,5d,2h'.split(',');
      var handStr = holdem.evaluate(hand);

      expect(handStr.value).toEqual([3, 14, 5, 12]);
    });

    it('pair', () => {
      var hand = 'Qd,Ts,As,5c,Kc,5d,2h'.split(',');
      var handStr = holdem.evaluate(hand);

      expect(handStr.value).toEqual([2, 5, 14, 13, 12]);
    });

    it('high card', () => {
      var hand = 'As,5c,3d,Qs,8c,9d,2h'.split(',');
      var handStr = holdem.evaluate(hand);

      expect(handStr.value).toEqual([1, 14, 12, 9, 8, 5]);
      expect(handStr.intValue).toEqual(11412090805);
    });
  });

  describe('name', () => {
    it('straight flush', () => {
      var hand = 'Ks,Ts,9s,Js,Qs'.split(',');
      var handStr = holdem.evaluate(hand);

      expect(handStr.name).toEqual(
        'King-high straight flush');
    });

    it('a flush', () => {
      var hand = 'Ks,2s,9s,Js,Qs'.split(',');
      var handStr = holdem.evaluate(hand);

      expect(handStr.name).toEqual(
        'Flush: King,Queen,Jack,Nine,Deuce-high');
    });

    it('quads', () => {
      var hand = 'Ks,Kh,Kd,Kc,3s,3c,8s'.split(',');
      var handStr = holdem.evaluate(hand);

      expect(handStr.name).toEqual(
        'Quads of Kings with Eight kicker');
    });


  });
});

describe('holdem#evaluate', () => {
  it('does not check for quads', () => {
    var hand = 'Ks,Ts,9s,Js,Qs'.split(',');

    spyOn(holdem, 'isQuads').and.callThrough();
    spyOn(holdem, 'isStraightFlush').and.callThrough();

    holdem.evaluate(hand);

    expect(holdem.isStraightFlush).toHaveBeenCalled();
    expect(holdem.isQuads).not.toHaveBeenCalled();
  });

});
