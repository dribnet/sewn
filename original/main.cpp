#include "acApp.h"

/* void main(void) {
  acuOpen();
  acWindowManager *wm = new acWindowManager();
  wm->winGroup->addWindow(makeApp());
  wm->winGroup->swapFullScreen();
  wm->selfStart();
}*/

/* if you prefer a simpler main, you can use this */

int main(int argc, char **argv)
{
  acuOpen();
  acApp *a = makeApp(); 
  a->selfStart();
}

