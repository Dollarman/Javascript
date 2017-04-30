/*
In this kata, you have to implement two functions: isCheck and isMate.

Both of the functions are given two parameters: player signifies who just moved and pieces is an array of objects describing a piece and its location in the following fashion: Tell whether the player put the other in check.

{
  piece: string, // pawn, rook, knight, bishop, queen or king
  owner: int,    // 0 for white or 1 for black
  x: int,        // 0-7 where 0 is the leftmost column (or "A")
  y: int,        // 0-7 where 0 is the top row (or "8")
  prevX: int,    // 0-7, presents this piece's previous x, only given if this is the piece that was just moved
  prevY: int     // 0-7, presents this piece's previous y, only given if this is the piece that was just moved
}*/


  // Returns an array of threats if the arrangement of 
// the pieces is a check, otherwise false
function isCheck(pieces, player){
  var white = 0, black= 1;
  // if (player == 1) {enemy = 0;}
  // else {enemy = 1;}
  var whitePieces = [], blackPieces = []; 
  pieces.map(function(piece){
    (piece[owner] == white) ? whitePieces.push(piece)  : "" ; 
  });
  pieces.map(function(piece){
    (piece[owner] == black) ? blackPieces.push(piece)  : "" ; 
  });

  for (piece of whitePieces){

  }
}
/*
king, pawn, rook, knight, bishop, queen
x, y from 0-7.
*/
function movements(pieceName,x,y) {
  var res = [];
  if (pieceName == "rook") {
     for (i=0; i < 8; i ++) {
       if (i == x) {continue;}
       res.push( [i,y] );
     } for (j=0; j < 8; j++) {
       if (j == y) {continue;}
       res.push( [x,j] );
     }
     return res;
  }

  if (pieceName == "king") {
    return [pos(x + 1) , y]
  }



}

// Returns true if the arrangement of the
// pieces is a check mate, otherwise false
function isMate(pieces, player){
  
}