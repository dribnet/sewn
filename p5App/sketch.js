const canvasWidth = 1024;
const canvasHeight = 768;

let B = null;

function setup () {
  let main_canvas = createCanvas(canvasWidth, canvasHeight);
  if (document.getElementById('sewnContainer') != null) {
    main_canvas.parent('sewnContainer');
  }

  rectMode(CORNERS);

  B = new Block();
  B.setRect(0.2*400,0.2*400,0.8*400,0.8*400);

  // enable right click
  for (let element of document.getElementsByClassName("p5Canvas")) {
    element.addEventListener("contextmenu", (e) => e.preventDefault());
  }
  background(0);
}

function draw () {
  translate(0, height); 
  scale(1, -1);

  B.setRect( 0.2*width,0.2*height,0.8*width,0.8*height );
  fill(255);

  B.BalanceSplit();
  B.UpdateChildren();
  B.Draw();
  B.drawLines();
}

function doSimulatedMousePress(whichButton, mx, my, extra_info) {
  C = B.MouseInBlock(mx, my);
  if (whichButton == CENTER) {
    if (C != null && C.parent != null) {
      C.parent.UnsplitBegin();
    }
  }
  else if (whichButton == RIGHT) {
    if ( C != null ){
      C.Split( VERTICAL, 0.5, extra_info );
    }
  }
  else if (whichButton == LEFT) {
    if ( C != null ){
      C.Split( HORIZONTAL, 0.5, extra_info );
    }
  }
}

function mouseReleased() {
  let flippedY = height - mouseY;
  if (mouseButton == RIGHT || (mouseButton == LEFT && keyIsDown(CONTROL))) {
    doSimulatedMousePress(RIGHT, mouseX, flippedY);
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
  if (key == 'a' || key == 'd') {
    let direction = (key == 'd');
    doSimulatedMousePress(LEFT, mouseX, flippedY, direction);
    return false;
  }
  else if (key == ' ') {
    doSimulatedMousePress(CENTER, mouseX, flippedY);
    return false;
  }
  else if (key == 'w' || key == 's') {
    let direction = (key == 'w');
    doSimulatedMousePress(RIGHT, mouseX, flippedY, direction);
    return false;
  }
}

function keyPressed() {
  let flippedY = height - mouseY;
  if (keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW) {
    let direction = (keyCode == RIGHT_ARROW);
    doSimulatedMousePress(LEFT, mouseX, flippedY, direction);
    return false;
  }
  if (keyCode == UP_ARROW || keyCode == DOWN_ARROW) {
    let direction = (keyCode == UP_ARROW);
    doSimulatedMousePress(RIGHT, mouseX, flippedY, direction);
    return false;
  }
  else if (keyCode == BACKSPACE || keyCode == DELETE) {
    doSimulatedMousePress(CENTER, mouseX, flippedY);
    return false;
  }
}

