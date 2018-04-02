var appServer = require('../../server/server');
var Trades = appServer.models.trades;
var fs = require('fs');
var data = fs.readFileSync("./data/OPTIDX_NIFTY_PE_30-Dec-2016_TO_13-Jan-2017.csv");
var rows = data.toString().split("\n");
var i = 0;
//cleanup();
//insertTrades();
function insertTrades() {
  if(rows && i < rows.length) {
    var row = rows[i];
    if (!(row.trim().length == 0)) {
      //console.log(row);
      var col = row.split(",");
      var data = {};
      data.symbol = col[0];
      data.tradedDate = new Date(col[1]);
      data.expiry = new Date(col[2]);
      data.optionType = col[3];
      data.strikePrice = col[4];
      data.open = col[5];
      data.high = col[6];
      data.low = col[7];
      data.close = col[8];
      data.ltp = col[9];
      data.settlePrice = col[10];
      data.noOfContracts = col[11];
      data.turnoverInLacs = col[12];
      data.premiumTurnover = col[8];
      insertRow(data, function(){
        i++;
        console.log("Inserting row : "+i);
        insertTrades();
      });
    }
  }
}

function insertRow(data, cb){
  Trades.create(data, function(err, response){
    if(response){
    }
    cb();
  });
}

function cleanup(){
  Trades.deleteAll(function(err, output){
    if(output){
      console.log("Rows Deleted : ");
      console.log(output);
    }
  });
}
// Symbol,
// Date,
// Expiry,
// Option Type,
// Strike Price,
// Open,
// High,
// Low,
// Close,
// LTP,
// Settle Price,
// No. of contracts,
// Turnover in Lacs,
// Premium Turnover in Lacs,
// Open Int,Change in OI,
// Underlying Value



