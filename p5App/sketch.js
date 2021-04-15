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
  if (key == 'a' || key == 'd' || key == '4' || key == '6') {
    let direction = ((key == 'd') || (key == '6'))
    doSimulatedMousePress(LEFT, mouseX, flippedY, direction);
    return false;
  }
  else if (key == ' ' || key == '5') {
    doSimulatedMousePress(CENTER, mouseX, flippedY);
    return false;
  }
  else if (key == 'w' || key == 's' || key == '8' || key == '2') {
    let direction = ((key == 'w') || (key == '8'))
    doSimulatedMousePress(RIGHT, mouseX, flippedY, direction);
    return false;
  }
  else if (key == 'g') {
    print(golan);
    decay_is_active = false;
    return false;
  }
  else if (key == 'h') {
    decay_is_active = true;
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

const golan = "\
\ndxxdxkxddONMWWWWNNNXXK0Okxxdolllcc:::;,,'''........      .....c0NNNNNNN0doclolc:\
\ndxxdxkxddOWMMMMWNNNXK0Okkxddoolc:::;;,''........           ....dXNXNNNNOlccccc::\
\nddddxkdookWMMMWWNNXK00Okxxdoool::;;;,,'''....                 .:0NXXNNX0l;::::::\
\nxxxxxxdooOWMMMWNNXKK0OOkkxddolc:;;;,;,'......                  'dKKKNNXKo:::::::\
\nddddddoooOWMMWWNNXK00OOkkxxdolc::;,;;,'........                .lO0KXXNKoc:;::::\
\noooooooolxNMMWWNNXK0OOOkkxddolc:;;;,,''.........               .:dOKKXNXxc:;;::c\
\noooooooolo0WMWWNNXK00OOkxddolc::;,,,''..........               .:ox0XXNXx::;;:::\
\noooooooolckWMWNNNXK0Okkxdoolcc:;,,'''..'.....                  .;oxOXKNKl;:;;;::\
\noooooooodkONWNNNNXXKOkkxddolc:;,,'''........                    .cxOKNNx;;;;;;;;\
\noooooolxXWWMWNNNNNNXKKK0Okxdlc:;'''..............'''''..         'd0XN0o:,',::;:\
\nooooolo0WWWMWWNWWWWWWWWNNXXK0koc:;;,'',;;:oodxOO0KKKOkkd:,..     .dXWXo,....;lcc\
\noooooldXWWMMWWWWWWWNNNNNNNNNNNKOxoc;;;lxkkxxkO0000Okxxdoollc.   .;0WWx.  ;o,.;;;\
\nooooolo0NWMWWWWWWWNNNNNNNWWNWNNNXkdl::cloloxkkOOOkkxxdollclc;. ..;kNNo.  co'.,,,\
\nooooooloKMMWWNNNNNNNNXNWNKXNXNNNNKOxol:;:d00KXXKXNNXK0Oxolldxl'..'kN0c   ::.';,;\
\nooooooloOWMMNXXXXNNNX0OKXX0kOXNNWWWWNNXNWKc:k0kokXX0x;,ll:..,OKOOKKKKo'  '..:c::\
\nooooooolo0MMNKXXKXNNXK0O00OOKXNNWWXklcxNMO;:xOOddkOkl,,,,,.  dWKkdxKOc:. ..';;;;\
\noooooooolkNMNKKXKKKXXK0OOO00KXNWWNOl,..dW0,.:oxxdoc:;,.     .xd.  ;KKc.....,,',,\
\nooooddooodKMWXO0XK00OOOOO000KXNWWXOl;. .:kx'..',:;,'..      cd.   lXK; ...',,,,,\
\nodooddooookWWNNXXXXXKXXXXXXNNNNNNXOo;.   .colcc::;,'''''',:ol.   'kNk.  .,,''',,\
\nxxdddoooddx0NWNXKK0000000000KXXNNXOl,.      .';:ccclccc:;,'.     c0o.  .;,'',,;;\
\nxxxkxdoddxxx0WWNXK0OOkkkkkOOKNNNX0dc,..                         .,,   .,;,,,,;;,\
\noooddoodddddkNWNXK0OkkkxxkOKXNNX0ko:'.                          .'...'';;,',,'''\
\nddxxxxxxooddxXWNXK0OkxxxxkKNNNXKOxc,.        ..                .';,'''';:,''''',\
\nddddddddodxxxKWWNKOkkxddxOXNNXXKOdc'.         ...            ...;;''''',,,;:;,,;\
\noddooooooddddkNWNX0OkxxkOO0XNNNNKkl;.   ..'.   ...          ...,;,''''';;;;;;:;,\
\nxxdddddddddddkXWWXKOO00K00KKXNNWNKxc;'''''..   ....        ...':,'''''';:,'',,,'\
\ndxxddxxxkkkkkkKWWNKKKXNXXXNXNNNX0kxk0xc;;;;''..''...      ....;:,'''''';;'''''''\
\ndddddddxxxxkkxONWNXXXXNNNNNNNXKOoccxOd:,',,,,,,,;;,'..   ....,;,''''''',,'''''''\
\ndddddddddxxxxkOXWWNXXK0KXNNNXK0Od:;cc;'.......'cllc:'.  .....':,''''''';;''',,,'\
\nddddddddxxkOkkOXWWWNX00O0KXNNXKK0Okdooolc:;,'..:kkdc'  ....,..,c;,'''',;;''',,,,\
\nddddddxdxxkkOKXWWMWNNXKK00KXNX0kdollcc;'.....  .;ll;'...',;.   .;lol;.';;'''',;;\
\ndxxxxxddxkO0NWMMMMMWNNXXK000KXK0kxoc::;'....   .,:::,..'::.      .;xOo:;,'''',;;\
\nxxxdxkO0XNWMMMMMMMWWWWNNXK0OkkkO000Okdlc:;.....,::::,.;c;.         .xKkoll;'',''\
\nxOO0XNWMMMWMMMMMMMWWWWNNXXK0kxxxxxxxxl;,''.';::;;::;:c:.           .xOkkkO0xc;,,\
\nXWWMWMMMMMMMMMMMMWNNWWNNNNNKOOOxdollc,'....',;;:,;ll:.            .o0OOOOOKKOkl;\
\nWWWWWMMMMMMMMMMMMWNWWNNNNNNXK0Oxdlll:,'''''';,,;::;.             'x0O0000KKK0kOk\
\nWWWWMMWWWWMMMMMMWWNNNNNXXNNNX0kxdxxdoc;,,,,,;;;;'.             .cO000K00KKKKOkO0\
\nWWWMMWWWWWWWMMMMWNNNNNNXK00XXX0kxkOOkdollll:;;'.              ;x000KKKKKKXX0OO00\
\nWMMMWWWWWWWWWWMMWNXXXXNXKOxodkOOOO000kxollc;....            ,x0000KKKKKXXXK0OO00\
\nWWWWWWWNWWWWNWWWWNXXKKXX0kdlc:clllcc:;,'....'..           .l0K000KKKKKKKK000O000";
