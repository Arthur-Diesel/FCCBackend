// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/:time", function (req, res) {

  var time = req.params.time
  contains_underscore = time.includes("-")

  if (contains_underscore)
  { 
    var array_time = time.split('-')
    var year = array_time[0]
    var month = array_time[1]
    var day = array_time[2]

    var date = new Date(year, month - 1, day)

    var unix = date.valueOf()
    var data = date.toString().replace("+0000 (Coordinated Universal Time)", "")

    res.json({unix: unix, utc: data})
  }
  else
  {
    var time = parseInt(time)
    var date = new Date(time);
    var data = date.toString().replace("+0000 (Coordinated Universal Time)", "")
    res.json({unix: time, utc: data})
  }
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
