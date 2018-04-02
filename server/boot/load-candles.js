var appServer = require('../../server/server');
var Candle = appServer.models.candle;
var fs = require('fs');
var data = fs.readFileSync("./data/NSEFO_22122016.csv");
//var data = fs.readFileSync("./data/test.csv");
var rows = data.toString().split("\n");
var batchSize = 10000;
var index = 0;
console.log(new Date());
var past = new Date();
/*Candle.deleteAll(function(err, response){
  if(response){
    console.log(response);
  }
  //insertCandlesAtATime();
  insertCandles();
});*/
var batch = [];
var count = 0;
var totalCount = 0;
console.log("Batch Size :" + batchSize);
function insertCandles(){
  if(index < rows.length ){
    var row = rows[index];
    if (!(row.trim().length == 0)) {
      var col = row.split(",");
      var data = {};
      data.ticker = col[0];
      //data.tradedDate = new Date(col[1]);
      //data.tradeTime = new Date(col[2]);
      data.open = col[3];
      data.high = col[4];
      data.low = col[5];
      data.close = col[6];
      data.volume = col[7];
      data.openInterest = col[8];
      if(count < batchSize){
        batch[count] = data;
        index++;
        count++;
        //console.log("index " + index +" rows.length "+rows.length);
        if(count == batchSize){
          persistCandle(insertCandles);
        }
        insertCandles();
      }
    } else {
      index++;
      if(index == rows.length){
        persistCandle(insertCandles);
      }
      insertCandles();
    }
  }
 }
function persistCandle(cb){
  Candle.create(batch, function(err, response){
    batch = [];
    count = 0;
    //console.log("Created records are : "+response.length);
    totalCount = totalCount + response.length;
    console.log("Created total records are : "+totalCount);
    console.log(((new Date() - past)/1000) + " seconds");
    cb();
  });
}
function insertCandlesAtATime() {

  var records = [];

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var col = row.split(",");
    var data = {};
    data.ticker = col[0];
    //data.tradedDate = new Date(col[1]);
    //data.tradeTime = new Date(col[2]);
    data.open = col[3];
    data.high = col[4];
    data.low = col[5];
    data.close = col[6];
    data.volume = col[7];
    data.openInterest = col[8];
    records[i] = data;
    Candle.create(records, function (err, response) {
      if (err) {
        console.log("Row is not created.");
      } else {
        console.log("Total record created : " + records.length);
      }
    });
  }
}


