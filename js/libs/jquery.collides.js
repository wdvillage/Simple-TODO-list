/*
  jQuery.collides plugin: collides 
  - simple collisionDetection
  © 2013 Thomas Frank, v 0.5b

*/

(function ($) {

  /* Check if one or more objects (DOM elments) collides
     with one or more other objects (DOM elements)

     If object collides the callbackFunc will be triggered.

     An optional third parameter is ms - how often the
     DOM will be checked. Default is 100 ms

     Collision detection is based on
     a simple bounding box method

       -----------------------------------------------------------

     Syntax for using:
     $("element(s)").collides("other element(s)", callbackFunc);

     callbackFunc will be triggered when element(s) and
     other element(s) collide. It will only be triggered once
     until one of the elements move again...
   */

  $.fn.collides = function(colliders,callbackFunc,ms) {
   
    if(!callbackFunc || !colliders){return;}
    ms = ms || 100;

     var a_arr = $.makeArray(this);
     colliders = $(colliders); 
     var b_arr = $.makeArray(colliders);
     var createObjs = function(arr){
       var narr = [], c;
       for(var i = 0; i < arr.length; i++){
         if(!arr[i].collides){arr[i] = $(arr[i]);}
         c = arr[i].offset();
        narr.push({
          top: c.top,
          left: c.left,
          bottom: c.top + arr[i].outerHeight(),
          right: c.left + arr[i].outerWidth()
        });
       }
       return narr
     };

     var collMem = {};

     setInterval(function(){
       var i, j, a = createObjs(a_arr), b = createObjs(b_arr), mem;
       for(var i = 0; i < a.length; i++){
         for(var j = 0; j < b.length; j++){
           var mem = 
             a[i].left+"_"+a[i].right+"_"+a[i].bottom+"_"+a[i].top+
             b[j].left+"_"+b[j].right+"_"+b[j].bottom+"_"+b[j].top;
           if(collMem[i+"_"+j] == mem){continue;}
           collMem[i+"_"+j] = mem;
           if (!(
            a[i].left > b[j].right || b[j].left > a[i].right
            || a[i].top > b[j].bottom || b[j].top > a[i].bottom
          )){
             callbackFunc(a_arr[i],b_arr[j]);
          }
         }
       }
     },ms);

    return this;
   
  };

})(jQuery);