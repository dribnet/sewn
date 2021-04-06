
#include "acApp.h"
#include "acu.h"
#include "block.h"

class sewnApp : public acApp
{
public:
  sewnApp();
  void draw();
  void mouseUp(float x, float y, int button);
  void resize( float posX, float posY, float width, float height);
  virtual void mouseMove(float x, float y);
  virtual void mouseDrag(float x, float y, int button);


  block *B;
  float T;
  boolean begun;
  float mX,mY;
};
