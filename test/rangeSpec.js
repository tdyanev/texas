var Range = require('../src/range');

//TODO drop this class???
//
xdescribe("A suite is just a function", function() {
  var range;

  beforeEach(() => {
    range = new Range();
  });


  it("unpacking pairs", function() {
    range.populate(['AA']);

    expect(range.hands).toContain('AcAs');
    expect(range.hands).not.toContain('AcAc');
    expect(range.hands).toContain('AcAh');
    expect(range.hands).toContain('AcAd');
    expect(range.hands).toContain('AdAs');
    expect(range.hands).not.toContain('AsAc');
  });

  it("unpacking suited hands", function() {
    range.populate(['AKs']);

    expect(range.hands).toContain('AcKc');
    expect(range.hands).toContain('AdKd');
    expect(range.hands).toContain('AsKs');
    expect(range.hands).toContain('AhKh');
    expect(range.hands).not.toContain('AhKs');
  });

  it("unpacking off-suited hands", function() {
    range.populate(['AKo']);

    expect(range.hands).toContain('AcKd');
    expect(range.hands).toContain('AdKs');
    expect(range.hands).not.toContain('AsKs');
    expect(range.hands).not.toContain('AhKh');
  });

  it('unpacking single hand', function() {
    range.populate(['AdKs']);

    expect(range.hands).toContain('AdKs');
    expect(range.hands).not.toContain('AsKs');
  });


  // not impleting those above yet


});
