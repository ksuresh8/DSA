
function convertjson2csv(fields, jsondata, cb){
  var csvdata = "";
  for(i = 0 ; i < jsondata.length; i++){
    for(j = 0; j < fields.length-1; j++) {
      csvdata = csvdata + jsondata[i][fields[j]] + ",";
    }
    csvdata = csvdata + jsondata[i][fields[j]];
    csvdata = csvdata + '\n';
  }
  cb(csvdata);
}

exports.convertjson2csv = convertjson2csv;
