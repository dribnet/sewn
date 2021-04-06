
#include "block.h"

#define acuLine2f ofDrawLine
#define acuCurrentTimeMillis ofGetElapsedTimeMillis
#define acuLerpf(f,a,b) ofLerp(a,b,f)

float block::pullVr = 0.4;
float block::pullVg = 0.0;
float block::pullVb = 0.0;

float block::pullHr = 0.8;
float block::pullHg = 0.6;
float block::pullHb = 0.0;

long  block::theTime = 0;

block::block()
{
  hasChildren = false;
  parent = NULL;
  childA = NULL;
  childB = NULL;
  setColor( 0.5,0.5,0.5 );
  setRect( 0, 0, 0, 0 );
  animType = NONE;
  LBRT[0] = LBRT[1] = LBRT[2] = LBRT[3] = false;
  complete = 1.0;
  unsplitCountdown = 0;
  unsplitBegun = false;
}

block::~block()
{
  if ( childA )
    delete childA;
  if ( childB )
    delete childB;
}

void block::Draw()
{
  if ( parent==NULL )  // only root sets time
    theTime = acuCurrentTimeMillis();

  if ( hasChildren )
    {
      childA->Draw();
      childB->Draw();
    }
  else
    {
      //glColor3f( 0.8,0.8,0.8 );
      glColor3f( cr, cg, cb );
      glRectf( L, B, R, T );

      /* glColor3f( 0.2,0.2,0.2 );
      acuLine2f( L,B,L,T );
      acuLine2f( L,B,R,B );
      acuLine2f( R,B,R,T );
      acuLine2f( L,T,R,T );*/
      
      /* glColor3f( 1,0,0 );
      if ( LBRT[0] )  // left
	acuLinef( L,B,L,T );
      if ( LBRT[1] )  // bottom
	acuLinef( L,B,R,B );
      if ( LBRT[2] )  // right
	acuLinef( R,B,R,T );
      if ( LBRT[3] )  // top
	acuLinef( L,T,R,T );*/
    }
  
}

void block::drawLines()
{
   if ( hasChildren )
    {
      childA->drawLines();
      childB->drawLines();
    }
  else
    {
      glColor3f( 0.2,0.2,0.2 );
      acuLine2f( L,B,L,T );
      acuLine2f( L,B,R,B );
      acuLine2f( R,B,R,T );
      acuLine2f( L,T,R,T );
    }
   
   if ( hasChildren && ! unsplitBegun )
    {
      if ( childA->hasChildren || childB->hasChildren )
	unsplitCountdown = theTime;
      else
	{
	  if ( theTime - unsplitCountdown > 30000 )  // 30 second delay
	    UnsplitBegin();
	}
    }
}

void block::Split( enum SplitType S, float P )
{
  if ( hasChildren )  // don't try to split twice
    return;

  unsplitCountdown = theTime;
  hasChildren = true;
  split = S;
  splitPercent = P;
  childA = new block;
  childB = new block;
  childA->parent = this;
  childB->parent = this;
  
  int choose = rand()%2;
  /* split = (choose) ? VERTICAL : HORIZONTAL;
  if ( (T-B) >= 3.0*(R-L) )
    split = VERTICAL;
  if ( (R-L) >= 3.0*(T-B) )
    split = HORIZONTAL;*/
  
  animateTime = 0.0;
  choose = rand()%2;
  if ( split==VERTICAL )
    {
      animType = (choose) ? BP_IN : TP_IN; return;
      /* if ( LBRT[0] )
	animType = (choose) ? LB_IN : LT_IN;
      if ( LBRT[1] )             
	 animType = BB_IN;
      if ( LBRT[2] )
	animType = (choose) ? RB_IN : RT_IN;
      if ( LBRT[3] )             
	animType = TT_IN;*/
    }
  if ( split==HORIZONTAL )
    { 
       animType = (choose) ? LP_IN : RP_IN; return;
       /*if ( LBRT[0] )             
	animType = LL_IN;
      if ( LBRT[1] )              
	 animType = (choose) ? BL_IN : BR_IN;
      if ( LBRT[2] )             
	animType = RR_IN;
      if ( LBRT[3] )                  
	animType = (choose) ? TL_IN : TR_IN;*/
    }
}

void block::UnsplitBegin()
{
  if ( ! hasChildren )  // don't try to unsplit the unsplit
    return;

  if ( unsplitBegun )
    return;

  unsplitBegun = true;

  childA->UnsplitBegin();
  childB->UnsplitBegin();

  animateTime = 0.0;
  int choose = rand()%2;
  if ( split==VERTICAL )
    {
      animType = (choose) ? BP_OUT : TP_OUT; return;
      /*if ( LBRT[0] )
	animType = (choose) ? LB_OUT : LT_OUT;
      if ( LBRT[1] )             
	 animType = BB_OUT;
      if ( LBRT[2] )
	animType = (choose) ? RB_OUT : RT_OUT;
      if ( LBRT[3] )             
	animType = TT_OUT;*/
    }
  if ( split==HORIZONTAL )
    { 
      animType = (choose) ? LP_OUT : RP_OUT; return;
      /* if ( LBRT[0] )              
	animType = LL_OUT;
      if ( LBRT[1] )              
	 animType = (choose) ? BL_OUT : BR_OUT;
      if ( LBRT[2] )               
	animType = RR_OUT;
      if ( LBRT[3] )                  
	animType = (choose) ? TL_OUT : TR_OUT; */
    }
}

void block::UnsplitFinish()
{
  if ( ! hasChildren )
    return;

  unsplitBegun = false;
  hasChildren = false;
  complete = 1.0;
  delete childA;
  delete childB;
  childA = NULL;
  childB = NULL;
  animType = NONE;
}

void block::UpdateChildren()
{
  if ( ! hasChildren )  // don't try to unsplit the unsplit
    return;

  float P = splitPercent;
  if ( P > 1.0 ) P = 1.0;
  if ( P < 0.0 ) P = 0.0;

  if ( animType != NONE )
    {
      childA->complete = animateTime;
      childB->complete = animateTime;
      if ( animateTime >= 1.0 )
	{
	  if ( animType==LB_OUT || animType==LT_OUT ||
	       animType==RB_OUT || animType==RT_OUT ||
	       animType==TL_OUT || animType==TR_OUT ||
	       animType==BL_OUT || animType==BR_OUT ||
	       animType==LL_OUT || animType==RR_OUT ||
	       animType==BB_OUT || animType==TT_OUT || 
	       animType==TP_OUT || animType==LP_OUT || 
	       animType==BP_OUT || animType==RP_OUT )
	    {
	      UnsplitFinish();
	      animType = NONE;
	      return;
	    }
	  else
	    {
	      animType = NONE;
	      goto NO_ANIMATE;
	    }
	}
      animateTime += 0.05;
      
      float A;
      if ( animType==LB_OUT || animType==LT_OUT ||
	   animType==RB_OUT || animType==RT_OUT ||
	   animType==TL_OUT || animType==TR_OUT ||
	   animType==BL_OUT || animType==BR_OUT ||
	   animType==LL_OUT || animType==RR_OUT ||
	   animType==BB_OUT || animType==TT_OUT ||
	   animType==TP_OUT || animType==LP_OUT ||
	   animType==BP_OUT || animType==RP_OUT )
	A = 1.0 - animateTime;
      else
	A = animateTime;
      // float W = acuGetInteger( ACU_WINDOW_WIDTH );
      // float H = acuGetInteger( ACU_WINDOW_HEIGHT );
      if ( A > 1.0 ) A = 1.0;
      if ( A < 0.0 ) A = 0.0;

      if ( split == VERTICAL )
	{
	  childA->setColor( acuLerpf( A, cr, (cr+pullVr)/2.0 ), 
			    acuLerpf( A, cg, (cg+pullVg)/2.0 ), 
			    acuLerpf( A, cb, (cb+pullVb)/2.0 ) );
	  childB->setColor( acuLerpf( A, cr, (cr+(1.0-pullVr))/2.0 ), 
			    acuLerpf( A, cg, (cg+(1.0-pullVg))/2.0 ), 
			    acuLerpf( A, cb, (cb+(1.0-pullVb))/2.0 ) );
	}
      if ( split == HORIZONTAL )
	{
	  childA->setColor( acuLerpf( A, cr, (cr+pullHr)/2.0 ), 
			    acuLerpf( A, cg, (cg+pullHg)/2.0 ), 
			    acuLerpf( A, cb, (cb+pullHb)/2.0 ) );
	  childB->setColor( acuLerpf( A, cr, (cr+(1.0-pullHr))/2.0 ), 
			    acuLerpf( A, cg, (cg+(1.0-pullHg))/2.0 ), 
			    acuLerpf( A, cb, (cb+(1.0-pullHb))/2.0 ) );
	}

      switch( animType )
	{
	case TP_IN: case TP_OUT:
	  childB->setLerpRect( A, L, T, R, T,
			       L, (T-B)*P+B, R, T );
	  childA->setLerpRect( A, L, B, R, T,
			       L, B, R, (T-B)*P+B );
	  break;
	case BP_IN: case BP_OUT:
	  childA->setLerpRect( A, L, B, R, B,
			       L, B, R, (T-B)*P+B );
	  childB->setLerpRect( A, L, B, R, T,
			       L, (T-B)*P+B, R, T );
	  break;
	case LP_IN: case LP_OUT:
	  childA->setLerpRect( A, L, B, L, T,
                                  L, B, L+(R-L)*P, T );
	  childB->setLerpRect( A, L, B, R, T,
                                  L+(R-L)*P, B, R, T );
	  break;
	case RP_IN: case RP_OUT:
	  childB->setLerpRect( A, R, B, R, T,
			          L+(R-L)*P, B, R, T );
	  childA->setLerpRect( A, L, B, R, T,
			          L, B, L+(R-L)*P, T );
	  break;


	  /*case LT_IN: case LT_OUT:
	  childB->setLerpRect( A, 0, T, (R-L), T,
			          L, (T-B)*P+B, R, T );
	  childA->setLerpRect( A, L, B, R, T,
			          L, B, R, (T-B)*P+B );
	  break;
	case LB_IN: case LB_OUT:
	  childB->setLerpRect( A, 0, B, (R-L), B,
			          L, B, R, (T-B)*P+B );
	  childA->setLerpRect( A, L, B, R, T,
			          L, (T-B)*P+B, R, T );
	  break;
	case RT_IN: case RT_OUT:
	  childB->setLerpRect( A, W-(R-L), T, W, T,
			          L, (T-B)*P+B, R, T );
	  childA->setLerpRect( A, L, B, R, T,
			          L, B, R, (T-B)*P+B );
	  break;
	case RB_IN: case RB_OUT:
	  childB->setLerpRect( A, W-(R-L), B, W, B,
			          L, B, R, (T-B)*P+B );
	  childA->setLerpRect( A, L, B, R, T,
			          L, (T-B)*P+B, R, T );
	  break;

	case TL_IN: case TL_OUT:
	  childB->setLerpRect( A, L, H-(T-B), L, H,
			          L, B, L+(R-L)*P, T );
	  childA->setLerpRect( A, L, B, R, T,
                                  L+(R-L)*P, B, R, T );
	  break;
	case TR_IN: case TR_OUT:
	  childB->setLerpRect( A, R, H-(T-B), R, H,
			          L+(R-L)*P, B, R, T );
	  childA->setLerpRect( A, L, B, R, T,
                                  L, B, L+(R-L)*P, T );
	  break;
	case BL_IN: case BL_OUT:
	  childB->setLerpRect( A, L, 0, L, (T-B),
			          L, B, L+(R-L)*P, T );
	  childA->setLerpRect( A, L, B, R, T,
                                  L+(R-L)*P, B, R, T );
	  break;
	case BR_IN: case BR_OUT:
	  childB->setLerpRect( A, R, 0, R, (T-B),
			          L+(R-L)*P, B, R, T );
	  childA->setLerpRect( A, L, B, R, T,
                                  L, B, L+(R-L)*P, T );
	  break;

	case LL_IN: case LL_OUT:
	  childB->setLerpRect( A, 0, T, 0, B,
			          L, T, L+(R-L)*P, B );
	  childA->setLerpRect( A, L, B, R, T,
                                  L+(R-L)*P, B, R, T );
	  break;
	case RR_IN: case RR_OUT:
	  childB->setLerpRect( A, W, T, W, B,
			          L+(R-L)*P, T, R, B );
	  childA->setLerpRect( A, L, B, R, T,
                                  L, B, L+(R-L)*P, T );
	  break;
	case TT_IN: case TT_OUT:
	  childB->setLerpRect( A, L, H, R, H,
			          L, (T-B)*P+B, R, T );
	  childA->setLerpRect( A, L, B, R, T,
                                  L, B, R, (T-B)*P+B );
	  break;
	case BB_IN: case BB_OUT:
	  childB->setLerpRect( A, L, 0, R, 0,
			          L, B, R, (T-B)*P+B );
	  childA->setLerpRect( A, L, B, R, T,
                                  L, (T-B)*P+B, R, T );
	  break;*/
	  
	}
    }
  
NO_ANIMATE:
  if ( animType==NONE ) // don't animate, just set in place
    {
      // P = 0.5;
      if ( split == VERTICAL )
	{
	  childA->setColor( (cr+pullVr)/2.0,
			    (cg+pullVg)/2.0, 
			    (cb+pullVb)/2.0  );
	  childB->setColor( (cr+(1.0-pullVr))/2.0,
			    (cg+(1.0-pullVg))/2.0,
			    (cb+(1.0-pullVb))/2.0  );
	  childA->setRect( L,B,R,(T-B)*P+B );
	  childB->setRect( L,(T-B)*P+B,R,T );
	}
      if ( split == HORIZONTAL )
	{
	  childA->setColor( (cr+pullHr)/2.0,
			    (cg+pullHg)/2.0, 
			    (cb+pullHb)/2.0  );
	  childB->setColor( (cr+(1.0-pullHr))/2.0,
			    (cg+(1.0-pullHg))/2.0,
			    (cb+(1.0-pullHb))/2.0  );
	  childA->setRect( L,B,L+(R-L)*P,T );
	  childB->setRect( L+(R-L)*P,B,R,T );
	}
    }

  childA->UpdateChildren();
  childB->UpdateChildren();
}

void block::EvaluateEdges( float l, float b, float r, float t )
{
  /*  LBRT[0] = ( l==L );
  LBRT[1] = ( b==B );
  LBRT[2] = ( r==R );
  LBRT[3] = ( t==T ); */
  if ( hasChildren )
    {
      childA->EvaluateEdges( l, b, r, t );
      childB->EvaluateEdges( l, b, r, t );
    }
}

void block::setRect( float l, float b, float r, float t )
{
  L = l;
  T = t;
  R = r;
  B = b;
}

void block::setLerpRect( float A, 
			 float l1, float b1, float r1, float t1,
			 float l2, float b2, float r2, float t2 )
{
  A = (A<0) ? 0 : A;
  A = (A>1) ? 1 : A;
  A = pow( A, 0.7 );
  L = acuLerpf( A, l1, l2 );
  B = acuLerpf( A, b1, b2 );
  R = acuLerpf( A, r1, r2 );
  T = acuLerpf( A, t1, t2 );
}

void block::setColor( float red, float green, float blue )
{
  cr = red;
  cg = green;
  cb = blue;
}

float block::getArea()
{
  return (T-B)*(R-L);
}

float block::getMaxRatio()
{
  if ((T-B)>(R-L))
    return (T-B)/(R-L);
  else
    return (R-L)/(T-B);
	     
}

block* block::GetLargestEdgeBlock()
{
  if ( ! hasChildren )
    {
      if ( LBRT[0] || LBRT[1] || LBRT[2] || LBRT[3] )
	return this;
      else
	return NULL;
    }

  block *bA = childA->GetLargestEdgeBlock();
  block *bB = childB->GetLargestEdgeBlock();

  if ( bA==NULL && bB==NULL )
    return NULL;
  if ( bA==NULL && bB!=NULL )
    return bB;
  if ( bA!=NULL && bB==NULL )
    return bA;
  if ( bA!=NULL && bB!=NULL )
    {
      if ( bA->getArea()/bA->getMaxRatio() == bB->getArea()/bB->getMaxRatio() )
	{
	  if (rand()%2==0)
	    return bA;
	  else
	    return bB;
	}
      if ( bA->getArea()/bA->getMaxRatio() > bB->getArea()/bB->getMaxRatio() )
	return bA;
      else
	return bB;
    }
}

block* block::MouseInBlock( float X, float Y )
{
  if ( hasChildren )
    {
      block* b1 = childA->MouseInBlock( X,Y );
      if ( b1 )
	return b1;
      b1 = childB->MouseInBlock( X,Y );
      if ( b1 )
	return b1;
      return NULL;
    }
  
  if ( X>=L && X<=R && Y>=B && Y<=T )
    return this;
  else
    return NULL;
}

int   block::getNumLeaves()
{
  if ( ! hasChildren )
    return 1;
  else
    return childA->getNumLeaves() + childB->getNumLeaves();
}

void  block::BalanceSplit()
{
  if ( ! hasChildren )
    return;
  
  childA->BalanceSplit();
  childB->BalanceSplit();
  
  float na = childA->getNumLeaves();
  float nb = childB->getNumLeaves();
  float D = (na+nb);
  if ( D == 0 )
    D = 1;
  splitPercent = 0.95*splitPercent + 0.05*(na/(D));
}
