require('dotenv').config();
const express = require('express');
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({extended: false}))

const mongo_uri = process.env['MONGO_URI']
mongoose.connect(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true });

const short_url_schema = new mongoose.Schema
({
  id: Number,
  original_url: 
  {
    type: String, 
    required: true
  }
})

const Short_url = mongoose.model('Short_url', short_url_schema)

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) =>
{
  var original_url = req.body.url 
  console.log(original_url)

  check_http = original_url.includes("http://")
  check_https = original_url.includes("https://")

  if(check_http == false && check_https == false)
  {
    res.json(({ error: 'invalid url' }))
    return;
  }

  Short_url.find()
  .sort({ id: -1 })
  .limit(1)
  .exec((err, data) =>
  {

    if(err)
    {
      res.json({err: err})
      throw err;
    }

    var latest_id = data[0]['id']
    var new_latest_id = latest_id + 1

    const short_url = new Short_url
    ({
      id: new_latest_id,
      original_url: original_url
    })
    
    short_url.save((err,data) =>
    {
      if(err)
      {
        res.json({err: err})
        throw err;
      }
      res.json({original_url: original_url, short_url: new_latest_id})
    })
      
  })
})

app.get('/api/shorturl/:url', (req, res) =>
{
  var id = req.params.url
  Short_url.findOne({ id: id }, (err, data) =>
  {
    if(err)
    {
      res.json({err: err})
      throw err;
    }
      try
      {
        res.redirect(data['original_url'])
      }
      catch(err)
      {
        res.json({error: "No short URL found for the given input!"})
      }
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
