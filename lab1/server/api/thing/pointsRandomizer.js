/**
 * Created by Jarek on 07.03.15.
 */
(function () {

  var fs = require('fs');
  var RandomPoints = function (count, range) {
    var i;
    this.points = [];
    for (i = 0; i < count; i++) {
      this.points.push({
        "x": Math.floor(Math.random() * range + 1),
        "y": Math.floor(Math.random() * range + 1)
      });
    }
  };

  var randomPoints = new RandomPoints(10000, 99000);
  var objToSave = JSON.stringify(randomPoints);

  fs.writeFile("../../components/pointsDataSource/pointsGenerated.json",objToSave, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("The file was saved!");
    }
  })


}());
