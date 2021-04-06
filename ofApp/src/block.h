#pragma once
#include "ofMain.h"

enum SplitType { VERTICAL, HORIZONTAL };
enum animationType { NONE, LB_IN, LB_OUT, LT_IN, LT_OUT,
                           RB_IN, RB_OUT, RT_IN, RT_OUT,
                           TL_IN, TL_OUT, TR_IN, TR_OUT,
                           BL_IN, BL_OUT, BR_IN, BR_OUT, 
                           LL_IN, LL_OUT, RR_IN, RR_OUT,
                           BB_IN, BB_OUT, TT_IN, TT_OUT,
                           TP_IN, TP_OUT, LP_IN, LP_OUT,
                           BP_IN, BP_OUT, RP_IN, RP_OUT };

class block
{
public:
  block();
  ~block();
  
  bool hasChildren;
  block* parent;
  block *childA, *childB;
  enum SplitType split;
  float splitPercent;
  float L, B, R, T;
  bool  LBRT[4];
  float cr, cg, cb;
  float animateTime, complete;
  float unsplitCountdown;
  bool unsplitBegun;
  enum animationType animType;

  void Draw();
  void drawLines();
  void Split( enum SplitType S, float P );
  void UnsplitBegin();
  void UnsplitFinish();
  void UpdateChildren();
  void EvaluateEdges( float l, float b, float r, float t );
  void setRect( float l, float b, float r, float t );
  void setLerpRect( float A, 
		    float l1, float b1, float r1, float t1,
		    float l2, float b2, float r2, float t2 );
  void setColor( float red, float green, float blue );
  float getArea();
  float getMaxRatio();
  int   getNumLeaves();
  void  BalanceSplit();

  block* GetLargestEdgeBlock();
  block* MouseInBlock( float X, float Y );

  static float pullVr, pullVg, pullVb;
  static float pullHr, pullHg, pullHb;
  static long theTime;
};


