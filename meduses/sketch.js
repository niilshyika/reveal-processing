let width = window.innerWidth - 20;
let height = window.innerHeight - 20;

var creatures = [];

function setup() {
    createCanvas(width, height);
    [1,2,3,4,5,6].forEach(() => creatures.push(new Creature(createVector(width/2, height/2), 12, 12, 10, 50, 10, 3)))
};

function draw() {
    background(39,39,39);
    for (var a = 0; a < creatures.length; a++) {
        creatures[a].update()
    }
};

function mousePressed() {
    creatures.pop()
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
            part.position.x += this.compactness * i * cos(this.orientation);
            part.position.y += this.compactness * i * sin(this.orientation);
            part.clr = color(230, 255 - coul * i);
            this
                .parts
                .push(part);
        }
    }

    update() {
        var pos0 = this.parts[0].position;
        var pos1 = this.parts[1].position;
        pos0.set(this.position.copy());
        pos1.x = pos0.x + (this.compactness * cos(this.orientation));
        pos1.y = pos0.y + (this.compactness * sin(this.orientation));

        for (var i = 2; i < this.nbParts; i++) {
            var currentPos = this
                .parts[i]
                .position
                .copy();
            var dist = currentPos.sub(this.parts[i - 2].position.copy());
            var distmag = dist.mag();
            var pos = this
                .parts[i - 1]
                .position
                .copy();
            var move = dist
                .mult(this.compactness)
                .copy();
            move.div(distmag);
            pos.add(move);
            this
                .parts[i]
                .position
                .set(pos);
        }
    }

    draw() {
        for (var i = this.nbParts - 1; i >= 0; i--) {
            var part = this.parts[i];
            noStroke();
            fill(part.clr);
            ellipse(part.position.x, part.position.y, part.width, part.height);
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

        this.headClr = color(random(50, 200), random(50, 200), random(50, 200));

        this.dest = createVector(random(-1, 1), random(-1, 1));
        this
            .dest
            .mult(this.moveDistance);
        this.lastPos = this
            .position
            .copy();
        this.moveDuration = random(100, 150);
        this.moveDistance = random(200, 400);
        this.reachedDest = false;
        this.moveTime = 0;

        for (var i = 0; i < this.nbTentacles; i++) {
            var tx = this.position.x + (cos(i * TWO_PI / this.nbTentacles) * this.radX / 2);
            var ty = this.position.y + (sin(i * TWO_PI / this.nbTentacles) * this.radY / 2);
            var tr = atan2(ty - this.position.y, tx - this.position.x);
            var tentacle = new Tentacle(createVector(tx, ty), this.tentaclesLength, ts, ts, tr, td);
            this
                .tentacles
                .push(tentacle);
        }
    }

    update() {
        for (var i = 0; i < this.nbTentacles; i++) {
            var t = this.tentacles[i];
            t.position.x = this.position.x + (cos((i * TWO_PI / this.nbTentacles) + this.orientation) * this.radX / 2);
            t.position.y = this.position.y + (sin((i * TWO_PI / this.nbTentacles) + this.orientation) * this.radY / 2);
            t.orientation = atan2((t.position.y - this.position.y), (t.position.x - this.position.x));
            t.update();
        }

        if (this.reachedDest) {
            this.lastPos = this
                .position
                .copy();
            this.dest = createVector(random(-1, 1), random(-1, 1));
            this
                .dest
                .normalize();
            this
                .dest
                .mult(this.moveDistance);

            // var nextPos = this.position.add(this.position, this.dest);
            var nextPos = p5
                .Vector
                .add(this.position, this.dest);
            if (nextPos.x > width) 
                this.dest.x = -abs(this.dest.x);
            else if (nextPos.x < 0) 
                this.dest.x = abs(this.dest.x);
            if (nextPos.y > height) 
                this.dest.y = -abs(this.dest.y);
            else if (nextPos.y < 0) 
                this.dest.y = abs(this.dest.y);
            this.reachedDest = false;
            this.moveTime = 0;
        } else {
            this.position.x = Penner.easeInOutExpo(this.moveTime, this.lastPos.x, this.dest.x, this.moveDuration);
            this.position.y = Penner.easeInOutExpo(this.moveTime, this.lastPos.y, this.dest.y, this.moveDuration);
            this.moveTime++;
            if (this.moveTime >= this.moveDuration) 
                this.reachedDest = true;
            }
        this.orientation += random(-3, 3) * radians(.5);

        fill(0/*headClr*/);
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
            return c / 2 * pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-pow(2, -10 * --t) + 2) + b;
    }
}