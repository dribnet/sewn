#pragma once
#include "ofMain.h"
#include "block.h"

class sewnApp : public ofBaseApp
{
public:
  sewnApp();
  void draw();
  void mouseReleased(int x, int y, int button);
  void windowResized(int width, int height);
  virtual void mouseMoved(int x, int y);
  virtual void mouseDragged(int x, int y, int button);


  block *B;
  float T;
  bool begun;
  float mX,mY;
};
