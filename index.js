// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

//helper functions

const isEpoch = (input) => {
  return /^\d+$/.test(input);
}


const dateFormatter = (req, res, next) =>{
  const {date} = req.params;
  if(isEpoch(date)){
    req.unix = parseInt(date);
    req.utc = new Date(req.unix).toUTCString();
  }else{
    req.unix = new Date(date).getTime();
    req.utc = new Date(date).toUTCString();
  }
  next();
}
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.use("/api/:date?",(req,res,next) =>{
  const date = req.params.date;
  if(!date){
    res.json({
      "unix": new Date().getTime(),
      "utc": new Date().toUTCString()
    })
  } else {
    next()
  }
})
// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});




app.get("/api/:date?",dateFormatter,function(req,res) {
  res.send(req.unix?{unix:req.unix,utc:req.utc}: {error:"Invalid Date"})

  
})



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
