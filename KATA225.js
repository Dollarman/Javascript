// List of primes less than 100: [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89, 97]
/* Hacker Solution: 
Includes Greatest Common Denominator and Least Common Multiple as a way to solve neighbors.
function closestNeighbor(n, a, b, c) {
  const gcd=(x,y)=>y?gcd(y,x%y):x,
        lcm=(x,y)=>x*y/gcd(x,y)
  var l=lcm(lcm(a,b),c),m=n%l
  return [n-(m||l),n-m+l]
}
*/
function closest_neighbors(n,a,b,c) {
  var prime_factors_abc = [factorize(a) , factorize(b) , factorize(c) ];
  var factorsDict = {};
  // count the prime factorsDict of each (a,b,c) to find the multiplication of it
  var counts = {};
  for (i in prime_factors_abc){
    factorsDict = prime_factors_abc[i];
    for (factor in factorsDict) {
      if (factor in counts){
        //pick the max value of the counts.
        counts[factor] = (counts[factor] > factorsDict[factor]) ? counts[factor] : factorsDict[factor];
      }
      else {counts[factor] = factorsDict[factor];}
    }
  }
  console.log(counts);
  var pf_abc = 1; 
  for (fac in counts) {
    pf_abc *= Math.pow(fac, counts[fac]);
  }
  console.log(pf_abc);
  var abc_fit = n / pf_abc | 0; // num | 0 is casting to int from double created in division. 
  console.log(abc_fit);
  var left_neighbor = pf_abc * abc_fit;
  var right_neighbor = left_neighbor + pf_abc;

  return [left_neighbor,right_neighbor];
}
// I will only factorize ints between 1 and 100.
function factorize(x) {
  var primes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97];
  var myX = x;
  var factors = {};
  var prime;
  while (myX > 1) {
    for (i in primes) {
      prime = primes[i];
      if (myX % prime == 0) {
        if (prime in factors) {
          factors[prime] += 1;
        } else {
          factors[prime] = 1;
        }
        myX /= prime;
        break;
      } 
    }
  } 
  return factors;
}
console.log(factorize(8));
console.log(factorize(18));
console.log(factorize(19));
console.log("got: " + closest_neighbors(39675,8,18,19) + " expected: " + "[39672, 41040]");
/*Testing for:
n = 39675
a = 8
b = 18
c = 19 
Expected: [39672, 41040], instead got: [39672, 39900]
got: 39672,40014 expected: [39672, 41040]
require("./KATA225.js")
*/


