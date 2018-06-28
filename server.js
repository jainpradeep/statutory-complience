//db.dropDatabase()
var express        = require('express');  
var morgan         = require('morgan');  
var bodyParser     = require('body-parser');  
var methodOverride = require('method-override');  
var app            = express();  
var router         = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID; 
var bodyParser = require('body-parser');
var cors = require('cors');
var pumpedTotalist = [];
var quarterTotalist = [];
var stationTotalist = [];
var yearList = [];
var path = require('path');
var moment = require('moment');
var config = require('./config');
var fs = require('fs')
const multer = require('multer');
const DIR = './uploads';
var emailConfig = require('./emailConfig.js');

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    console.log(req.toString + " -----------------")
    cb(null, file.originalname);
  }
});
let upload = multer({storage: storage});


app.post('/api/upload',upload.single('file'), function (req, res) {
  console.log(req.file.filename);  
  if (!req.file) {
        console.log("No file received");
        return res.send({
          success: false
        });
    
      } else {
        console.log('file received');
        return res.send({
          success: true
        })
      }
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors())
router.use(function(req, res, next) {  
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {  
  console.log('Express up and listening on port ' + app.get('port'));
});

app.route('/insertStatutoryClearence')  
    .post(function (req, res) {
      MongoClient.connect("mongodb://10.14.151.91:27017/statutoryClearence", function(err, database) {
        if (err) return
            req.body.date = new Date(req.body.date)
            database.db('statutoryClearence').collection('clearamceDB').insert(req.body, function(err, records) {
                if (err) throw err;
                res.send(
                    (err === null) ? {msg: 'success'} : {msg: err}
                );
            });
        })
    });  

app.route('/deleteStatutoryClearence')  
    .post(function (req, res) {
       MongoClient.connect("mongodb://10.14.151.91:27017/statutoryClearence", function(err, database) {
            if (err) return
            req.body._id = new ObjectID.createFromHexString(req.body._id.toString());
            database.db('statutoryClearence').collection('clearamceDB').remove({"_id": req.body._id}, function(err, rec) {
                if (err) throw err;
                res.send(
                    (err === null) ? {msg: 'success'} : {msg: err}
                );
            });
        })
    });

app.route('/editStatutoryClearence')  
    .post(function (req, res) {
        MongoClient.connect("mongodb://10.14.151.91:27017/statutoryClearence", function(err, database) {
            if (err) return
            req.body._id = new ObjectID.createFromHexString(req.body._id.toString());
            req.body.date = new Date(req.body.date)
            database.db('statutoryClearence').collection('clearamceDB').update({"_id": req.body._id}, {$set : req.body }, function (err, result) {
                res.send(
                    (err === null) ? {msg: 'success'} : {msg: err}
                );
            });
        })
    });    
app.route('/getStatutoryClearence').post(function (req, res) {
      var equipmentData = []    
     // req.body.date = new Date(req.body.date);
      MongoClient.connect("mongodb://10.14.151.91:27017/statutoryClearence",function(er,database){     
          if (er) return
             database.db('statutoryClearence').collection('clearamceDB').find({}).toArray(function(err, result) {
              if (err) throw err;
              console.log(result);
              database.close();
              res.send(result);
            });
          //   aggregate([
          //         {
          //              $match:{'date':
          //                  {
          //                      $lte: new Date(req.body.date.setHours(23,59,59,999)),
          //                      $gte: new Date(req.body.date.setHours(0,0,0,0))
          //                  }
          //             /*, 'line':
          //                 {
          //                     $eq: req.body.line
          //                 }*/
          //            // }
          //           }
          //     ]).toArray(function (err, items){
          //         res.send(JSON.stringify(items));
          //     });
           })
      })
  
app.route('/authenticate')  
    .post(function (req, res) {
        console.log(req.body)
        config.ad.authenticate("IOC\\" + req.body.username  , req.body.password, function(err, auth) {
          
          if (err) {
            console.log("error" + err);
            return;
          }
          if (auth) {

            res.send({"msg": "success"
          })
            // var groupName = 'NRPL:BIJWASAN_OPERATIONS_DASHBOARD_ADMIN';
            //     config.ad.isUserMemberOf(req.body.userName, groupName, function(err, isMember) {
            //       if (err) {
            //         return;
            //       }

            //     });
          }
          else {
                res.status(500).send('Something broke!')
          }
        });
    });


app.route("/sendReminderEmail")
.post(function (req, res) {
  console.log(req.body)
  emailConfig.server.send({
    text:    "The CCE license for station " + req.body.clearenceData.station + " "  + "is due for expiry on" + req.body.clearenceData.expiryDate + "Action may be initiated for renewal", 
    from:    "pradeepjain@indianoil.in", 
    to:     req.body.to,
    cc:      "",
    subject: "testing emailjs"
  }, function(err, message) { 
    res.send({"msg": "success",
  })
    console.log(err || message); }); 
});


app.use('/', router);




