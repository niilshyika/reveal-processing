var t = function (p) {
  var inc = 0.1;
  var scl = 10;
  var cols, rows;

  var zoff = 0;
  var maxParticles = 400;
  var particles = [];

  var flowfield;

  p.setup = () => {
    p.createCanvas(1000, 1000);
    p.background(255);
    cols = p.floor(p.width / scl);
    rows = p.floor(p.height / scl);

    flowfield = new Array(cols * rows);

    for (var i = 0; i < maxParticles; i++) {
      particles[i] = new Particle();
    }
  }
  p.draw = function () {
    var yoff = 0;
    for (var y = 0; y < rows; y++) {
      var xoff = 0;
      for (var x = 0; x < cols; x++) {
        var index = (x + y * cols);
        var angle = p.noise(xoff, yoff, zoff) * p.TWO_PI;
        var v = p5.Vector.fromAngle(angle);
        v.setMag(0.1);
        flowfield[index] = v;
        xoff += inc;
      }
      yoff += inc;
      zoff += 0.0002;

    }
    for (var i = 0; i < maxParticles; i++) {
      particles[i].follow(flowfield);
      particles[i].update();
      particles[i].edges();
      particles[i].show();
    }

  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  function Particle() {
    this.pos = p.createVector(p.random(p.width), p.random(p.height));
    this.vel = p.createVector(0, 0);
    this.acl = p.createVector(0, 0);
    this.maxspeed = 2;
    this.prevPos = this.pos.copy();

    this.update = function () {
      this.vel.add(this.acl);
      this.vel.limit(this.maxspeed);
      this.pos.add(this.vel);
      this.acl.mult(0);
    }

    this.applyForce = function (force) {
      this.acl.add(force);
    }

    this.show = function () {
      p.stroke(0, 5);
      p.strokeWeight(1);
      p.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
      this.updatePrev();
    }

    this.updatePrev = function () {
      this.prevPos.x = this.pos.x;
      this.prevPos.y = this.pos.y;
    }

    this.edges = function () {
      if (this.pos.x > p.width) {
        this.pos.x = 0;
        this.updatePrev();
      }
      if (this.pos.x < 0) {
        this.pos.x = p.width;
        this.updatePrev();
      }
      if (this.pos.y > p.height) {
        this.pos.y = 0;
        this.updatePrev();
      }
      if (this.pos.y < 0) {
        this.pos.y = p.height;
        this.updatePrev();
      }
    }

    this.follow = function (vectors) {
      var x = p.floor(this.pos.x / scl);
      var y = p.floor(this.pos.y / scl);
      var index = x + y * cols;
      var force = vectors[index];
      this.applyForce(force);
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////
};

var myp5 = new p5(t, 'c2');