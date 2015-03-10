/**
 * Created by Jarek on 07.03.15.
 */
(function () {
  "use strict";
  var _ = require('lodash');
  var fs = require('fs');
  var points = JSON.parse(fs.readFileSync('/Users/Jarek/Desktop/UGFakultety/AlgorytmyP.Zylinski/lab1/server/components/pointsDataSource/pointsGenerated.json', 'utf8'));
  //var points = JSON.parse(fs.readFileSync('/Users/Jarek/Desktop/UGFakultety/AlgorytmyP.Zylinski/lab1/server/components/pointsDataSource/points.json', 'utf8'));

  var sortPoints = function (points, coordinate) {
    return _.sortBy(points, coordinate);
  };
  var calcDistance = function (pointA, pointB) {
    return Math.sqrt(Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2));
  };
  var boundaryPoints = function (points, boundaryLine, delta) {
    var temp = [];
    temp = _.forEach(points, function (entry) {
      if (Math.abs(boundaryLine - entry.x) < delta) {
        temp.push(entry);
      }
    });
    //console.log("boundaryPoints", temp);
    return temp;
  };
  var partitionY = function(points,l){
    var temp =[[],[]];
    _.forEach(points,function(entry){
      if(entry.x <= l){
        temp[0].push(entry);
      }
      else{
        temp[1].push(entry);
      }
    });
    return temp;
  };

  var partitionPoints = function (points) {
    var temp = [];
    //var start = new Date().getTime();
    temp = _.chunk(points, Math.ceil(points.length / 2));
    //var end = new Date().getTime();
    //console.log('execution partitionPoints', end - start);
    return temp;
  };
  var closestPairBruteForce = function (points) {
    var delta;
    var closestPair = [];
    var i;
    var j;
    //console.log("pointsLength", points.length);
    for (i = 0; i < points.length; i++) {
      for (j = i + 1; j < points.length; j++) {
        //console.log("all",calcDistance(points[i], points[j]));
        if (delta !== 'undefined') {
          if (calcDistance(points[i], points[j]) < delta) {
            delta = calcDistance(points[i], points[j]);
            closestPair[0] = points[i];
            closestPair[1] = points[j];
          }
        }
        else {
          delta = calcDistance(points[i], points[j]);
          closestPair[0] = points[i];
          closestPair[1] = points[j];
        }

      }
    }
    return {"delta": delta, "closestPair": closestPair};
  };

  var closestPairRecursive = function (sortedPointsByX, sortedPointsByY) {
    var count = sortedPointsByX.length;
    // console.log(sortedPointsByX[0], sortedPointsByX[1]);
    if (count === 2) {
      return {
        "delta": calcDistance(sortedPointsByX[0], sortedPointsByX[1]),
        "closestPair": [sortedPointsByX[0], sortedPointsByX[1]]
      };
    }
    if (count === 3) {
      return closestPairBruteForce(sortedPointsByX);
    }
    var partition = partitionPoints(sortedPointsByX);
    var S1 = partition[0]; //left part
    //console.log("S1", S1);
    var S2 = partition[1]; // right part
    //console.log("S2", S2);
    var S3 = partitionY(sortedPointsByY);
    //console.log("S3", S3);

    var resultOfS1 = closestPairRecursive(S1, S3[0]); //left result
    //console.log("actual resultOfS1", resultOfS1);
    var resultOfS2 = closestPairRecursive(S2, S3[1]); //right result
    //console.log("actual resultOfS2", resultOfS2);
    var closestPair = resultOfS1.delta < resultOfS2.delta ? resultOfS1.closestPair : resultOfS2.closestPair;
    var delta = resultOfS1.delta < resultOfS2.delta ? resultOfS1.delta : resultOfS2.delta; //min{d(p1,p2),d(q1,q2)}
    //console.log("actual delta", delta);
    //console.log(JSON.stringify(resultOfS1, null, ' '));
    //console.log(JSON.stringify(S2, null, ' '));
    var l = _.last(S1).x; //the divider l-line
    //console.log("l line", l);
    var deltaBoundaryPoints = boundaryPoints(sortedPointsByY, l, delta); //sorted boundary points by y
    var i, j;
    var pLower, pUpper;
    for (i = 0; i <= deltaBoundaryPoints.length - 1; i++) {
      pLower = deltaBoundaryPoints[i];
      for (j = i + 1; j <= deltaBoundaryPoints.length - 1; j++) {
        pUpper = deltaBoundaryPoints[j];
        //console.log("pLower", pLower);
        //console.log("pUpper", pUpper);
        if (pUpper.y - pLower.y >= delta) {
          break;
        }

        if (calcDistance(pUpper, pLower) < delta) {
          delta = calcDistance(pUpper, pLower);
          closestPair[0] = pUpper;
          closestPair[1] = pLower;
        }
      }
    }
    return {"delta": delta, "closestPair": closestPair};
  };

  //INITIAL SORT by X and Y
  var sortedByX = sortPoints(points.points, 'x');
  var sortedByY = sortPoints(points.points, 'y');
  var start = new Date().getTime();
  var result = closestPairRecursive(sortedByX, sortedByY);
  console.log("result: ", result);
  var end = new Date().getTime();
  console.log('execution took', end - start);
  start = new Date().getTime();
  console.log(closestPairBruteForce(points.points));
  end = new Date().getTime();
  console.log('execution took', end - start);

  var cpRecursive = {
    "closestPairRecursive": closestPairRecursive,
    "sortedByX": sortedByX,
    "sortedByY": sortedByY
  };
  exports.cpRecursive = cpRecursive;


}());
