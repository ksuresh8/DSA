var fs = require('fs');
var https = require('https');
var props = fs.readFileSync("./server/props.json");
props = JSON.parse(props);
var schedule = require('node-schedule');
//console.log(props);
var nse_options_url = props.nse_options_url;
//console.log(nse_options_url);
var request = require('request');
var HttpsProxyAgent = require('https-proxy-agent');
var proxy = 'http://www-proxy.us.oracle.com:80';
var agent = new HttpsProxyAgent(proxy);
var htmlparser = require('htmlparser2');
var appServer = require('../../server/server');
var NiftyOptions = appServer.models.niftyoptions;
var options = {
  host: "www.nseindia.com",
  path: "/live_market/dynaContent/live_watch/option_chain/optionKeys.jsp?symbolCode=-10003&symbol=NIFTY&symbol=NIFTY&instrument=-&date=-&segmentLink=17&symbolCount=2&segmentLink=17",
  headers: {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
  },
  //agent: agent,
  timeout: 10000,
  followRedirect: true,
  maxRedirects: 10
};
console.log("Scheduled ...........");

/*schedule.scheduleJob("daystart", {})*/

//completeResponse = fs.readFileSync("./data/nse_fo.html");
schedule.scheduleJob("*/1 * * * *", function(){
  fetchDate();
});
function fetchDate() {
  var completeResponse = "";
  https.get(options, function(res) {
    console.log('statusCode: ', res.statusCode);
    res.on('data', function(chunk) {
      completeResponse+=chunk;
    });

    res.on('end', function(chunk){
      parseData(completeResponse);
    });
  });
}

/*var tags = [];
var tagsCount = {};
var tagsWithCount = [];
var read = false;
var currentTag = "";
var row = "";
var content = ""
var start = false;
var finalstop = false;
var parsedData = new htmlparser.Parser({
  onopentag: function(name, attribs) {
    if(!finalstop && name == "td" && (attribs.class == "ylwbg" || attribs.class == "nobg")){
      row = "";
      read = true;
      start = true
    }
    if(!finalstop && name == "tr" && start){
      content = content + '\n';
    }
  },
  ontext: function(text){
    if(!finalstop && read){
      row = text.trim()+",";
      content = content+row;
    }
  },
  onend: function(tagName) {
    if(!finalstop && (tagName == "td" || read)){
      read = false;
    }
    if(!finalstop && tagName == "table" && start){
      finalstop = true;
    }

  }
}, {decodeEntities: true});
parsedData.write(completeResponse);
parsedData.end();
console.log(content);*/

var dateStr = new Date().toISOString().
replace(/T/, ' ').      // replace T with a space
replace(/\..+/, '')     // delete the dot and everything after
function parseData(completeResponse) {
  var cheerio = require('cheerio');
  var $ = cheerio.load(completeResponse);
  var tbl = $('#octable tr:has(td)').map(function (i, v) {
    var $td = $('td', this);
    return {
      ndate: dateStr,
      ce_oi: $td.eq(1).text().trim(),
      ce_changeoi: $td.eq(2).text().trim(),
      ce_volume: $td.eq(3).text().trim(),
      ce_ltp: $td.eq(4).next().text().trim(),
      ce_net_change: $td.eq(6).text().trim(),
      strikeprice: $td.eq(11).text(),
      pe_net_change: $td.eq(16).text().trim(), //(correct)
      pe_ltp: $td.eq(16).next().text().trim(),
      pe_volume: $td.eq(19).text().trim(), //(correct)
      pe_changeoi: $td.eq(20).text().trim(), //(correct)
      pe_oi: $td.eq(21).text().trim() //(correct)
    }
  }).get();
  //console.log(tbl);
  var utils = require("../../utils/json2csv");
  var fields = ["ndate", "ce_oi", "ce_changeoi", "ce_volume", "ce_ltp", "ce_net_change", "strikeprice",
    "pe_net_change", "pe_ltp", "pe_volume", "pe_changeoi", "pe_oi"];
  NiftyOptions.create(tbl, function(err, data){
    console.log('Records persisted :' + data.length);
  });
  /*utils.convertjson2csv(fields, tbl, function(csvdata){
    console.log(csvdata);
  });*/

}
