function isFunction(pairs) {
  var mypairs = pairs;
  mypairs.sort(function(a,b){
    return a[0] - b[0];
  });
  for (i=0;i<mypairs.length - 1;i++) {
    if (mypairs[i + 1][0] == mypairs[i][0]) {
      if (mypairs[i + 1][1] != mypairs[i][1]) {
        return false;
      }
    }
  }
  return true;
}

console.log(isFunction( [[0.5,1.5],[2.5,3.5]] ));