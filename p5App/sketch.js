const canvasWidth = 960;
const canvasHeight = 720;

let B = null;
let mx=null, my=null;

function setup () {
  createCanvas(canvasWidth, canvasHeight);
  rectMode(CORNERS);

  B = new Block();
  B.setRect(0.2*400,0.2*400,0.8*400,0.8*400);
  mx = 0;
  my = 0;
  // noLoop();
  // colorMode(HSB, 360, 100, 100, 1);

  // enable right click
  for (let element of document.getElementsByClassName("p5Canvas")) {
    element.addEventListener("contextmenu", (e) => e.preventDefault());
  }
}

function draw () {
  translate(0, height); 
  scale(1, -1);

  background(0);
  B.setRect( 0.2*width,0.2*height,0.8*width,0.8*height );
  fill(255);

  B.BalanceSplit();
  B.UpdateChildren();
  B.Draw();
  B.drawLines();
}

function doSimulatedMousePress(whichButton, mx, my) {
  C = B.MouseInBlock(mx, my);
  if (whichButton == RIGHT) {
    if (C != null && C.parent != null) {
      C.parent.UnsplitBegin();
    }
  }
  else if (whichButton == CENTER) {
    if ( C != null ){
      C.Split( VERTICAL, 0.5  );
    }
  }
  else if (whichButton == LEFT) {
    if ( C != null ){
      C.Split( HORIZONTAL, 0.5  );
    }
  }
}

function mouseReleased() {
  let flippedY = height - mouseY;
  if (mouseButton == RIGHT || (mouseButton == LEFT && keyIsDown(CONTROL))) {
    doSimulatedMousePress(LEFT, mouseX, flippedY);
  }
  else if (mouseButton == CENTER || (mouseButton == LEFT && keyIsDown(OPTION))) {
    doSimulatedMousePress(CENTER, mouseX, flippedY);
  }
  else if (mouseButton == LEFT) {
    doSimulatedMousePress(LEFT, mouseX, flippedY);
  }
}

function keyTyped() {
  let flippedY = height - mouseY;
  if (key == 'a' || key == '1') {
    doSimulatedMousePress(LEFT, mouseX, flippedY);
  }
  else if (key == 's' || key == '2') {
    doSimulatedMousePress(CENTER, mouseX, flippedY);
  }
  else if (key == 'd' || key == '3') {
    doSimulatedMousePress(RIGHT, mouseX, flippedY);
  }
}

function keyPressed() {
  let flippedY = height - mouseY;
  if (keyCode == LEFT_ARROW) {
    doSimulatedMousePress(LEFT, mouseX, flippedY);
  }
  if (keyCode == UP_ARROW || keyCode == DOWN_ARROW) {
    doSimulatedMousePress(CENTER, mouseX, flippedY);
  }
  else if (keyCode == RIGHT_ARROW) {
    doSimulatedMousePress(RIGHT, mouseX, flippedY);
  }
}

