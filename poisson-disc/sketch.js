var mass = [];
var positionX = [];
var positionY = [];
var velocityX = [];
var velocityY = [];

var maxParticles = 150;

var height;
var width;
var count = 0;
/////////////////////////////////////////////////////////////////////////////////////////////////////

function setup() {
  width = windowWidth - 20;
  height = windowHeight - 20;
  createCanvas(width, height);
  noStroke();
  fill(236, 39, 93, 192);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

function draw() {
  background(39);

  for (var particleA = 0; particleA < mass.length; particleA++) {
    var accelerationX = 0, accelerationY = 0;

    for (var particleB = 0; particleB < mass.length; particleB++) {
      if (particleA != particleB) {
        var distanceX = positionX[particleB] - positionX[particleA];
        var distanceY = positionY[particleB] - positionY[particleA];

        var distance = sqrt(distanceX * distanceX + distanceY * distanceY);
        if (distance < 1) distance = 1;

        var force = (distance - 320) * mass[particleB] / distance;
        accelerationX += force * distanceX;
        accelerationY += force * distanceY;
      }
    }

    velocityX[particleA] = velocityX[particleA] * 0.99 + accelerationX * mass[particleA];
    velocityY[particleA] = velocityY[particleA] * 0.99 + accelerationY * mass[particleA];
  }

  for (var particle = 0; particle < mass.length; particle++) {
    positionX[particle] += velocityX[particle];
    positionY[particle] += velocityY[particle];

    ellipse(positionX[particle], positionY[particle], mass[particle] * 1000, mass[particle] * 1000);
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

function addNewParticle() {
  count++
  mass.push(random(0.003, 0.03));
  count == 1 ? positionX.push(width / 2) : positionX.push(width / 2 + random(-400, 400));
  count == 1 ? positionY.push(height / 2) : positionY.push(height / 2 + random(-400, 400));
  velocityX.push(0);
  velocityY.push(0);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// setInterval(() =>
//   count < maxParticles && addNewParticle()
//   , .5)

// function mouseClicked() {
  
// }
let keyPressedCount = 0;
function keyPressed() {
  keyPressedCount++
  keyPressedCount == 1? setInterval(() =>
  count < maxParticles && addNewParticle()
  , .5) : document.getElementsByClassName('controls-arrow')[1].click()
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

// function mouseDragged() {
//   addNewParticle();
// }