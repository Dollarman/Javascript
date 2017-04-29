// WHOOOOOOOOO IM DONE 
/*
Author: Carlos Sanchez
Website: cssanchez.com

This function calculates the longest distance (+ 1) between two letters in a string s. 
Example: Input(abba) -> a4. 
Output is styled as: string( char + distanceToNextSameChar ) 
For some reason the Kata asks to add 1 to the distance, so distance in abba is 4. 
*/
function distSameLetter(s) {
    //coding and coding..
    var leftside = {},
        rightside = {},
        leftindex = 0,
        rightindex = s.length - 1,
        winner = [s.length +  2,""],
        curLeft, curRight, leftDist, rightDist;


    while (leftindex < s.length) {
        curLeft = s[leftindex];
        curRight = s[rightindex];
        // add left and right letters to dictionary with their leftmost and rightmost index.
        if (curLeft in leftside) {;}
        else {leftside[curLeft] = leftindex;}

        if (curRight in rightside) {;}
        else {rightside[curRight] = rightindex;}
        
        leftDist = rightside[curLeft] - leftindex + 1;
        rightDist = rightindex - leftside[curRight] + 1;
        // if you find a letter in the other side's dict, it is the one with largest distance.
        if (curLeft in rightside && (winner[1].slice(1) < leftDist || (winner[1].slice(1) == leftDist && leftindex <= winner[0]))) {
            winner[0] = leftindex;
            winner[1] = curLeft + leftDist;
        } 
        if (curRight in leftside && (winner[1].slice(1) < rightDist || (winner[1].slice(1) == rightDist && leftside[curRight] <= winner[0]))) {
            winner[0] = leftside[curRight];
            winner[1] = curRight + rightDist;
        }
        leftindex += 1;
        rightindex -= 1;
        
        if (rightindex < winner[1].slice(1) - 1) {break;}
    }
    return winner[1];

}



console.log("got: " + distSameLetter("abba") + " expected: " + "a23");

console.log("got: " + distSameLetter("ucabcabcabcdfxhuizfgrsuixacbcx") + " expected: " + "c28");

console.log("got: " + distSameLetter("iaufzhaifxhuzofghabcbacdbuzoxih") + " expected: " + "i30");

console.log("got: " + distSameLetter("axaxfaaiiiofizxuiox") + " expected: " + "x18");

console.log("got: " + distSameLetter("fxfaufhacaaacaaabbbabaddb") + " expected: " + "a19");

console.log("got: " + distSameLetter("haaafhahhhuuuiuuuuiiifxxx") + " expected: " + "f18");

console.log("got: " + distSameLetter("bmuhjbgpmnimgfyutytpuwhukgalzkbclmavwqlxitrkcdpkerkimlirqbrpzfcohkxogushdk") + " expected: " + "h69");
console.log("got: " + distSameLetter("aujwrpwimfebyhbfecftpnewkqtraurscplpbfzdtxbo") + " expected: " + "b32");

console.log("got: " + distSameLetter("mqekkvdcbukxbxbtdofljlafbtbaadlcwvnmfyulhzjahoeglmscxqigeghgqutygsabpmqc") + " expected: " + "m70");

var now = new Date(); 
console.log("Finished at " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds());