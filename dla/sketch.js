

let width = 600;
let height = 600;

var tree = [];
var walkers = [];
//var r = 4;
var maxWalkers = 500;
var iterations = 1000;
var radius = 8;
var hu = 0;
var shrink = 0.995;

function setup() {
  frameRate(40)
  var cnv = createCanvas(width, height);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
  // colorMode(HSB);
  // for (var x = 0; x < width; x += r * 2) {
  //   tree.push(new Walker(x, height));
  // }

  tree[0] = new Walker(width / 2, height / 2);
  radius *= shrink;
  for (var i = 0; i < maxWalkers; i++) {
    walkers[i] = new Walker();
    radius *= shrink;
  }
}

function draw() {
  background(39,39,39);

  for (var i = 0; i < tree.length; i++) {
    tree[i].show();
  }

  for (var i = 0; i < walkers.length; i++) {
    walkers[i].show();
  }

  for (var n = 0; n < iterations; n++) {
    for (var i = walkers.length - 1; i >= 0; i--) {
      walkers[i].walk();
      if (walkers[i].checkStuck(tree)) {
        walkers[i].setHue(hu % 360);
        hu += 2;
        tree.push(walkers[i]);
        walkers.splice(i, 1);
      }
    }
  }

  var r = walkers[walkers.length - 1].r;
  while (walkers.length < maxWalkers && radius > 1) {
    radius *= shrink;
    walkers.push(new Walker());
  }

}
