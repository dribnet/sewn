// split type
const VERTICAL = 0;
const HORIZONTAL = 1;

// animation types
const ANIM_NONE = 0;
const LB_IN = 1;
const LB_OUT = 2;
const LT_IN = 3;
const LT_OUT = 4;
const RB_IN = 5;
const RB_OUT = 6;
const RT_IN = 7;
const RT_OUT = 8;
const TL_IN = 9;
const TL_OUT = 10;
const TR_IN = 11;
const TR_OUT = 12;
const BL_IN = 13;
const BL_OUT = 14;
const BR_IN = 15;
const BR_OUT = 16;
const LL_IN = 17;
const LL_OUT = 18;
const RR_IN = 19;
const RR_OUT = 20;
const BB_IN = 21;
const BB_OUT = 22;
const TT_IN = 23;
const TT_OUT = 24;
const TP_IN = 25;
const TP_OUT = 26;
const LP_IN = 27;
const LP_OUT = 28;
const BP_IN = 29;
const BP_OUT = 30;
const RP_IN = 31;
const RP_OUT = 32;

// color constants
const pullVr = 0.4;
const pullVg = 0.0;
const pullVb = 0.0;
const pullHr = 0.8;
const pullHg = 0.6;
const pullHb = 0.0;

// millisecond based timer used to unsplit blocks after 30 seconds
let theTime = 0;

// OG lerp function (different argument order)
function acuLerpf(A, l1, l2) {
  return lerp(l1, l2, A);
}

function Block() {
  this.hasChildren = false;
  this.parent = null;
  this.childA = null;
  this.childB = null;
  this.split = null;
  this.splitPercent = 0;
  this.L = 0;
  this.R = 0;
  this.B = 0;
  this.T = 0;
  this.cr = 0.5;
  this.cg = 0.5;
  this.cb = 0.5;
  this.animateTime = 0.0;
  this.complete = 1.0;
  this.unsplitCountdown = 0;
  this.unsplitBegun = false;
  this.animType = ANIM_NONE;

  this.Draw = function() {
    if (this.parent == null) {
      // only root sets time
      theTime = millis();
    }
    if (this.hasChildren) {
      this.childA.Draw();
      this.childB.Draw();
    }
    else {
      fill(this.cr * 255, this.cg * 255, this.cb * 255);
      noStroke();
      rect(this.L, this.B, this.R, this.T);
    }
  }

  // lines get drawn after the rectangles
  this.drawLines = function() {
    if (this.hasChildren) {
      this.childA.drawLines();
      this.childB.drawLines();
    }
    else {
      noFill();
      stroke(int(0.2*255));
      rect(this.L, this.T, this.R, this.B);
    }

    if ( this.hasChildren && ! this.unsplitBegun ) {
      if ( this.childA.hasChildren || this.childB.hasChildren )
        this.unsplitCountdown = theTime;
      else {
        if ( theTime - this.unsplitCountdown > 30000 ) {
          // 30 second delay
          this.UnsplitBegin();
        }
      }
    }
  }

  this.Split = function(S, P, extra_hint) {
    if(this.hasChildren) {
      // don't try to split twice
      return;
    }

    this.unsplitCountdown = theTime;
    this.hasChildren = true;
    this.split = S;
    // splitPercent will be computed
    this.splitPercent = P;
    this.childA = new Block();
    this.childB = new Block();
    this.childA.parent = this;
    this.childB.parent = this;

    let choose = random([false, true]);
    if (extra_hint !== undefined) {
      choose = extra_hint;
    }
    this.animateTime = 0.0;

    if (this.split == VERTICAL) {
      if (choose) {
        this.animType = BP_IN;
      }
      else {
        this.animType = TP_IN;
      }
    }
    if (this.split == HORIZONTAL) {
      if (choose) {
        this.animType = LP_IN;
      }
      else {
        this.animType = RP_IN;
      }
    }
  }

  this.UnsplitBegin = function() {
    if (! this.hasChildren) {
      return;
    }

    if (this.unsplitBegun) {
      return;
    }

    this.unsplitBegun = true;

    this.childA.UnsplitBegin();
    this.childB.UnsplitBegin();

    this.animateTime = 0.0;
    let choose = random([false, true]);
    if ( this.split==VERTICAL ) {
      if (choose) {
        this.animType = BP_OUT;
      }
      else {
        this.animType = TP_OUT;
      }
    }
    if ( this.split==HORIZONTAL ) { 
      if (choose) {
        this.animType = LP_OUT;
      }
      else {
        this.animType = RP_OUT;
      }
    }
  }

  this.UnsplitFinish = function() {
    if (! this.hasChildren) {
      return;
    }

    this.unsplitBegun = false;
    this.hasChildren = false;
    this.complete = 1.0;
    this.childA = null;
    this.childB = null;
    this.animType = ANIM_NONE;
  }

  // sub funciton implements goto logic in original
  // returns true if calling function should also return
  this.update_subroutine = function(P) {
    if ( this.animType != ANIM_NONE ) {
      this.childA.complete = this.animateTime;
      this.childB.complete = this.animateTime;
      if ( this.animateTime >= 1.0 ) {
        if ( this.animType==LB_OUT || this.animType==LT_OUT ||
             this.animType==RB_OUT || this.animType==RT_OUT ||
             this.animType==TL_OUT || this.animType==TR_OUT ||
             this.animType==BL_OUT || this.animType==BR_OUT ||
             this.animType==LL_OUT || this.animType==RR_OUT ||
             this.animType==BB_OUT || this.animType==TT_OUT || 
             this.animType==TP_OUT || this.animType==LP_OUT || 
             this.animType==BP_OUT || this.animType==RP_OUT ) {
            this.UnsplitFinish();
            this.animType = ANIM_NONE;
            return true;
        }
        else {
            this.animType = ANIM_NONE;
            return false;
        }
      }
      // note: animations run for 20 frames independent of wall time
      this.animateTime += 0.05;
    
      let A = 0.0;
      if ( this.animType==LB_OUT || this.animType==LT_OUT ||
        this.animType==RB_OUT || this.animType==RT_OUT ||
        this.animType==TL_OUT || this.animType==TR_OUT ||
        this.animType==BL_OUT || this.animType==BR_OUT ||
        this.animType==LL_OUT || this.animType==RR_OUT ||
        this.animType==BB_OUT || this.animType==TT_OUT ||
        this.animType==TP_OUT || this.animType==LP_OUT ||
        this.animType==BP_OUT || this.animType==RP_OUT ) {

        A = 1.0 - this.animateTime;
      }
      else {
        A = this.animateTime;
      }
      if ( A > 1.0 ) {
        A = 1.0;
      }
      if ( A < 0.0 ) {
        A = 0.0;
      }

      if ( this.split == VERTICAL ) {
        this.childA.setColor( acuLerpf( A, this.cr, (this.cr+pullVr)/2.0 ), 
              acuLerpf( A, this.cg, (this.cg+pullVg)/2.0 ), 
              acuLerpf( A, this.cb, (this.cb+pullVb)/2.0 ) );
        this.childB.setColor( acuLerpf( A, this.cr, (this.cr+(1.0-pullVr))/2.0 ), 
              acuLerpf( A, this.cg, (this.cg+(1.0-pullVg))/2.0 ), 
              acuLerpf( A, this.cb, (this.cb+(1.0-pullVb))/2.0 ) );
      }
      if ( this.split == HORIZONTAL ) {
        this.childA.setColor( acuLerpf( A, this.cr, (this.cr+pullHr)/2.0 ), 
              acuLerpf( A, this.cg, (this.cg+pullHg)/2.0 ), 
              acuLerpf( A, this.cb, (this.cb+pullHb)/2.0 ) );
        this.childB.setColor( acuLerpf( A, this.cr, (this.cr+(1.0-pullHr))/2.0 ), 
              acuLerpf( A, this.cg, (this.cg+(1.0-pullHg))/2.0 ), 
              acuLerpf( A, this.cb, (this.cb+(1.0-pullHb))/2.0 ) );
      }

      let L = this.L;
      let R = this.R;
      let T = this.T;
      let B = this.B;

      switch( this.animType ) {
        case TP_IN:
        case TP_OUT:
          this.childB.setLerpRect( A, L, T, R, T,
             L, (T-B)*P+B, R, T );
          this.childA.setLerpRect( A, L, B, R, T,
             L, B, R, (T-B)*P+B );
          break;
        case BP_IN:
        case BP_OUT:
          this.childA.setLerpRect( A, L, B, R, B,
             L, B, R, (T-B)*P+B );
          this.childB.setLerpRect( A, L, B, R, T,
             L, (T-B)*P+B, R, T );
          break;
        case LP_IN:
        case LP_OUT:
          this.childA.setLerpRect( A, L, B, L, T,
                                  L, B, L+(R-L)*P, T );
          this.childB.setLerpRect( A, L, B, R, T,
                                  L+(R-L)*P, B, R, T );
          break;
        case RP_IN:
        case RP_OUT:
          this.childB.setLerpRect( A, R, B, R, T,
                L+(R-L)*P, B, R, T );
          this.childA.setLerpRect( A, L, B, R, T,
                L, B, L+(R-L)*P, T );
          break;
      }
    }
    return false;
  }

  this.UpdateChildren = function() {
    if(! this.hasChildren) {
      return;
    }

    let P = this.splitPercent;
    if ( P > 1.0 ) {
      P = 1.0;
    }
    if ( P < 0.0 ) {
      P = 0.0;
    }

    let do_return = this.update_subroutine(P);
    if (do_return) {
      return;
    }
  
    let L = this.L;
    let R = this.R;
    let T = this.T;
    let B = this.B;

    if ( this.animType==ANIM_NONE ) {
      // don't animate, just set in place
      // P = 0.5;
      if ( this.split == VERTICAL ) {
        this.childA.setColor( (this.cr+pullVr)/2.0,
              (this.cg+pullVg)/2.0, 
              (this.cb+pullVb)/2.0  );
        this.childB.setColor( (this.cr+(1.0-pullVr))/2.0,
              (this.cg+(1.0-pullVg))/2.0,
              (this.cb+(1.0-pullVb))/2.0  );
        this.childA.setRect( L,B,R,(T-B)*P+B );
        this.childB.setRect( L,(T-B)*P+B,R,T );
        // childA.setRect( L,B,R,(T-B)*P+B );
        // childB.setRect( L,(T-B)*P+B,R,T );
      }
      if ( this.split == HORIZONTAL ) {
        this.childA.setColor( (this.cr+pullHr)/2.0,
                          (this.cg+pullHg)/2.0, 
                          (this.cb+pullHb)/2.0  );
        this.childB.setColor( (this.cr+(1.0-pullHr))/2.0,
                          (this.cg+(1.0-pullHg))/2.0,
                          (this.cb+(1.0-pullHb))/2.0  );
        this.childA.setRect( L,B,L+(R-L)*P,T );
        this.childB.setRect( L+(R-L)*P,B,R,T );
      }
    }

    this.childA.UpdateChildren();
    this.childB.UpdateChildren();
  }

  this.setRect = function(l, b, r, t) {
    this.L = l;
    this.B = b;
    this.R = r;
    this.T = t;
  }

  this.setLerpRect = function(A, 
                   l1, b1, r1, t1,
                   l2, b2, r2, t2 ) {
    A = (A<0) ? 0 : A;
    A = (A>1) ? 1 : A;
    A = Math.pow( A, 0.7 );
    this.L = acuLerpf( A, l1, l2 );
    this.T = acuLerpf( A, t1, t2 );
    this.R = acuLerpf( A, r1, r2 );
    this.B = acuLerpf( A, b1, b2 );
  }

  this.setColor = function(red, green, blue) {
    this.cr = red;
    this.cg = green;
    this.cb = blue;
  }

  this.MouseInBlock = function(X, Y) {
    if(this.hasChildren) {
      let b1 = this.childA.MouseInBlock(X, Y);
      if (b1 != null) {
        return b1;
      }
      b1 = this.childB.MouseInBlock(X, Y);
      if (b1 != null) {
        return b1;
      }
      return null;
    }
    if ( X>=this.L && X<=this.R && Y<=this.T && Y>=this.B ) {
      return this;
    }
    else {
      return null;
    }
  }

  this.getNumLeaves = function() {
    if(! this.hasChildren) {
      return 1;
    }
    else {
      let l1 = this.childA.getNumLeaves();
      let l2 = this.childB.getNumLeaves();
      return l1 + l2;
    }
  }

  this.BalanceSplit = function() {
    if(! this.hasChildren) {
      return;
    }
  
    this.childA.BalanceSplit();
    this.childB.BalanceSplit();
  
    let na = this.childA.getNumLeaves();
    let nb = this.childB.getNumLeaves();
    let D = (na+nb);
    if ( D == 0 ) {
      D = 1;
    }

    this.splitPercent = 0.95*this.splitPercent + 0.05*(na/(D));
  }
}
