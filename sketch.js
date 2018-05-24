
// Sketch Two
var t = function( p ) { 
  var x = 100.0; 
  var y = 100; 
  var speed = 2.5; 
  p.setup = function() {
    p.createCanvas(400, 200);
  };

  p.draw = function() {
    p.background(100);
    p.fill(1);
    x += speed; 
    if(x > p.width){
      x = 0; 
    }
    p.ellipse(x,y,50,50);

  };
};
var myp5 = new p5(t, 'c2');


var s = function sketch(p) {
  let width = 1200;
  let height = 800;

  var creatures = [];

  p.setup = () => {
    p.createCanvas(width, height);

  };

  p.draw = function () {
    p.background(255);
    for (var a = 0; a < creatures.length; a++) {
      creatures[a].update()
    }
  };

  p.mousePressed = () => {
    if(document.getElementById('defaultCanvas1'))
    creatures.push(new Creature(p.createVector(p.mouseX, p.mouseY), 12, 12, 10, 50, 10, 3))
  }



  class Tentacle {
    constructor(pos, nb, w, h, o, c) {
      this.position = pos;
      this.nbParts = nb;
      this.compactness = c;
      this.orientation = o;
      this.angularVelocity = 0;
      this.parts = [];

      var headWidth = w;
      var headHeight = h;
      var coul = 255 / this.nbParts;
      for (var i = 0; i < this.nbParts; i++) {
        var part = {};
        part.width = (this.nbParts - i) * headWidth / this.nbParts;
        part.height = (this.nbParts - i) * headHeight / this.nbParts;
        part.position = this
          .position
          .copy();
        part.position.x += this.compactness * i * p.cos(this.orientation);
        part.position.y += this.compactness * i * p.sin(this.orientation);
        part.clr = p.color(230, 255 - coul * i);
        this.parts.push(part);
      }
    }

    update() {
      var pos0 = this.parts[0].position;
      var pos1 = this.parts[1].position;
      pos0.set(this.position.copy());
      pos1.x = pos0.x + (this.compactness * p.cos(this.orientation));
      pos1.y = pos0.y + (this.compactness * p.sin(this.orientation));

      for (var i = 2; i < this.nbParts; i++) {
        var currentPos = this.parts[i]
          .position
          .copy();
        var dist =
          currentPos
          .sub(this.parts[i - 2].position.copy());
        var distmag = dist.mag();
        var pos = this.parts[i - 1]
          .position
          .copy();
        var move = dist.mult(this.compactness).copy();
        move.div(distmag);
        pos.add(move);
        this.parts[i]
          .position
          .set(pos);
      }
    }

    draw() {
      for (var i = this.nbParts - 1; i >= 0; i--) {
        var part = this.parts[i];
        p.noStroke();
        p.fill(part.clr);
        p.ellipse(part.position.x, part.position.y, part.width, part.height);
      }
    }
  }

  class Creature {
    constructor(pos, rx, ry, nb, l, ts, td) {
      this.position = pos;
      this.radX = rx;
      this.radY = ry;
      this.orientation = 0;

      this.nbTentacles = nb;
      this.tentaclesLength = l;
      this.tentacles = [];
      this.moveDistance = 0;

      this.headClr = p.color(p.random(50, 200), p.random(50, 200), p.random(50, 200));

      this.dest = p.createVector(p.random(-1, 1), p.random(-1, 1));
      this
        .dest
        .mult(this.moveDistance);
      this.lastPos = this
        .position
        .copy();
      this.moveDuration = p.random(100, 150);
      this.moveDistance = p.random(50, 150);
      this.reachedDest = false;
      this.moveTime = 0;

      for (var i = 0; i < this.nbTentacles; i++) {
        var tx = this.position.x + (p.cos(i * p.TWO_PI / this.nbTentacles) * this.radX / 2);
        var ty = this.position.y + (p.sin(i * p.TWO_PI / this.nbTentacles) * this.radY / 2);
        var tr = p.atan2(ty - this.position.y, tx - this.position.x);
        var tentacle = new Tentacle(p.createVector(tx, ty), this.tentaclesLength, ts, ts, tr, td);
        this.tentacles.push(tentacle);
      }
    }

    update() {
      for (var i = 0; i < this.nbTentacles; i++) {
        var t = this.tentacles[i];
        t.position.x = this.position.x + (p.cos((i * p.TWO_PI / this.nbTentacles) + this.orientation) * this.radX / 2);
        t.position.y = this.position.y + (p.sin((i * p.TWO_PI / this.nbTentacles) + this.orientation) * this.radY / 2);
        t.orientation = p.atan2((t.position.y - this.position.y), (t.position.x - this.position.x));
        t.update();
      }

      if (this.reachedDest) {
        this.lastPos = this.position.copy();
        this.dest = p.createVector(p.random(-1, 1), p.random(-1, 1));
        this.dest.normalize();
        this.dest.mult(this.moveDistance);

        // var nextPos = this.position.add(this.position, this.dest);
        var nextPos = p.createVector().add(this.position, this.dest);
        if (nextPos.x > width)
          this.dest.x = -p.abs(this.dest.x);
        else if (nextPos.x < 0)
          this.dest.x = p.abs(this.dest.x);
        if (nextPos.y > height)
          this.dest.y = -p.abs(this.dest.y);
        else if (nextPos.y < 0)
          this.dest.y = p.abs(this.dest.y);
        this.reachedDest = false;
        this.moveTime = 0;
      } else {
        this.position.x = Penner.easeInOutExpo(this.moveTime, this.lastPos.x, this.dest.x, this.moveDuration);
        this.position.y = Penner.easeInOutExpo(this.moveTime, this.lastPos.y, this.dest.y, this.moveDuration);
        this.moveTime++;
        if (this.moveTime >= this.moveDuration)
          this.reachedDest = true;
      }
      this.orientation += p.random(-3, 3) * p.radians(.5);

      p.fill(0 /*headClr*/ );
      for (var j = 0; j < this.nbTentacles; j++)
        this.tentacles[j].draw();
    }
  }

  class Penner {
    static easeInOutExpo(t, b, c, d) {
      if (t == 0)
        return b;
      if (t == d)
        return b + c;
      if ((t /= d / 2) < 1)
        return c / 2 * p.pow(2, 10 * (t - 1)) + b;
      return c / 2 * (-p.pow(2, -10 * --t) + 2) + b;
    }
  }

};

var myp5 = new p5(s, 'c1');