
#include "sewnApp.h"

#define THE_LEFT_BUTTON 0
#define THE_MIDDLE_BUTTON 1
#define THE_RIGHT_BUTTON 2

sewnApp::sewnApp()
{
  begun = false;
  B = NULL;
  srand( clock() );
  T = 1.0;

  B = new block();
  B->setRect( 0.2*400,0.2*400,0.8*400,0.8*400 );
  mX = mY = 0;
  // glutSetCursor( GLUT_CURSOR_NONE );
}

void sewnApp::windowResized(int width, int height)
{  
  // X = posX;
  // Y = posY;
  // B->setRect( 0.2*width,0.2*height,0.8*width,0.8*height );
  // W = width;
  // H = height;
}

void sewnApp::draw()
{
  int W = ofGetWindowWidth();
  int H = ofGetWindowHeight();

  B->setRect( 0.2*W,0.2*H,0.8*W,0.8*H );
  glColor3f(1,1,1);
  
  /* float rgb[3];
  float hsv[3];
  hsv[0] = fmod( T, 1.0 );
  hsv[1] = 1.0;
  hsv[2] = 1.0;
  acuHsbToRgb( hsv, rgb );
  block::pullVr = rgb[0];
  block::pullVg = rgb[1];
  block::pullVb = rgb[2];

  hsv[0] = fmod( T+0.25, 1.0 );
  hsv[1] = 1.0;
  hsv[2] = 1.0;
  acuHsbToRgb( hsv, rgb );
  block::pullHr = rgb[0];
  block::pullHg = rgb[1];
  block::pullHb = rgb[2];*/
  
  B->EvaluateEdges( B->L, B->B, B->R, B->T );

  /*if ( T%30==5 )
    {
      block* C = B->GetLargestEdgeBlock();
      switch( rand()%4 )
	{
	case 0:
	  C->Split( HORIZONTAL, 0.667 );
	  break;
	case 1:
	  C->Split( VERTICAL, 0.5 );
	  break;
	case 2:
	  C->Split( HORIZONTAL, 0.5 );
	  break;
	case 3:
	  C->Split( VERTICAL, 0.667 );
	  break;
	}
    }*/
   T += 0.001;

   //acuOpenFrame2D();
  B->BalanceSplit();
  B->UpdateChildren();
  B->Draw();
  B->drawLines();
  //acuCloseFrame2D();

  // cursor 
  glColor3f( 1,1,1 );
  glRectf( mX-9,mY-9,mX+9,mY+9 );
}

void sewnApp::mouseReleased(int x, int y, int button)
{
  if ( button==THE_LEFT_BUTTON )
    {
      begun = true;
	  
      block* C = B->MouseInBlock(x,y); // B->GetLargestEdgeBlock();
      if ( C )
	C->Split( HORIZONTAL, 0.5  );
    }
  
  if ( button==THE_MIDDLE_BUTTON )
    {
      block* C = B->MouseInBlock(x,y); // B->GetLargestEdgeBlock();
      if ( C )
	C->Split( VERTICAL, 0.5 );
    }
  

  /*      block* C = B;
	  while( C->hasChildren )
	  {
	  if ( rand()%2==0 )
	  C = C->childA;
	  else
	  C = C->childB;
	  }*/
  
  /* if ( rand()%2==0 )
     C->Split( HORIZONTAL, 0.5 );
     else
     C->Split( VERTICAL, 0.5 ); */

  if ( button==THE_RIGHT_BUTTON )
    {
      block* C = B->MouseInBlock(x,y); // B->GetLargestEdgeBlock();
     if ( C && C->parent )
	C->parent->UnsplitBegin();
      /* block* C = B;
      block* D = B;
      while( C->hasChildren )
	{
	  D = C;
	  if ( rand()%2==0 )
	      C = C->childA;
	  else
	      C = C->childB;
	}
      D->UnsplitBegin(); */
    }
}


void sewnApp::mouseMoved(int x, int y)
{
  mX = x;
  mY = y;
}


void sewnApp::mouseDragged(int x, int y, int button)
{
  mX = x;
  mY = y;
}
