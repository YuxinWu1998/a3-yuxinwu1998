var http = require('http')
  , qs = require('querystring')
  , path = require('path')
  , mongoose = require('mongoose')
  , fs   = require('fs')
  , url  = require('url')
  , port = 8080;


// NOTE: your dataset can be as simple as the following, you need only implement functions for addition, deletion, and modification that are triggered by outside (i.e. client) actions, and made available to the front-end
let mongoUrl = "mongodb://heroku_2h26wr6r:o5cbdk4o7uu7e8shib6cqst9gg@ds111113.mlab.com:11113/heroku_2h26wr6r";
mongoose.connect(mongoUrl, { useNewUrlParser: true });

mongoose.connection.on('connected', function () {
  console.log('Mongoose connection open to ' + mongoUrl);
});

mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose connection disconnected');
});

var waterSchema = new mongoose.Schema ({
  w_name: String,
  w_min: Number,
  w_age: Number,
  w_weight: Number,
});

let WaterModel = mongoose.model("Water", waterSchema);
var dataSet = []

var server = http.createServer (function (req, res) {
  var uri = url.parse(req.url)

  switch( uri.pathname ) {
    case '/':
      sendFile(res, 'public/index.html')
      break

    case '/index.html':
      sendFile(res, 'public/index.html')
      break

    case '/icon.ico':
      sendFile(res, 'icon.ico');
      break;

    case '/loadDB':
      WaterModel.find({}, function(err, docs) {
          if(err) {
              console.log("err");
          }else {
              dataSet = docs;
              console.log(dataSet);
              res.end(JSON.stringify(dataSet));
              console.log("Database load success!");
          }
      });
      break;

    case '/addItem':
      let postdata = '';
      req.on('data', function (d) {
          postdata += d;
      });
      req.on('end', function () {
          let obj = JSON.parse(postdata);
          let name = obj.name;
          let min = parseFloat(obj.min);
          let age = parseFloat(obj.age);
          let weight = parseFloat(obj.weight);
          let cal = 0;

          if (0 < age <= 30) {
            cal = ((((weight / 2.2) * 40) / 28.3) + min * 0.4).toFixed(2);
          } else if (30 < age <= 55) {
            cal = ((((weight / 2.2) * 35) / 28.3) + min * 0.4).toFixed(2);
          } else if (55 < age) {
            cal = ((((weight / 2.2) * 30) / 28.3) + min * 0.4).toFixed(2);
          };

          let data = {};
          data['name'] = name;
          data['min'] = min;
          data['age'] = age;
          data['weight'] = weight;
          data['cal'] = cal;

          let new_water = new WaterModel({
            w_name: obj.name,
            w_min: obj.min,
            w_age: obj.age,
            w_weight: obj.weight,
            w_cal: obj.cal,
          });

          new_water.save(function (err, res) {
          if (err) {
              console.log("Error:" + err);
            }
          else {
              console.log("Res:" + res);
            }
          });

          data['id'] = new_water._id;
          console.log(new_water._id);
          module.exports = mongoose.model("Water", waterSchema);

          dataSet.push(data);
          res.end(JSON.stringify(data));
      });
      break;

    case '/updateSection':
        let updateData = '';
        req.on('data', function (d) {
            updateData += d;
        });
        req.on('end', function () {
            let obj = JSON.parse(updateData);
            let name = obj.name;
            let min = parseFloat(obj.min);
            let age = parseFloat(obj.age);
            let weight = parseFloat(obj.weight);
            let cal = parseFloat(obj.cal);
            let id = obj.id;
            console.log(id);
            let query = {_id: id};
            WaterModel.updateOne(query, {
                w_name: name,
                w_min: min,
                w_age: age,
                w_weight: weight,
                w_cal: cal,
            }, {multi: true}, function (err, docs) {
                    if (err) console.log(err);
                    console.log('update' + docs);
                });
        });
      break;

    case '/deleteSection':
      let deleteData = '';
      req.on('data', function (d) {
          deleteData += d;
      });
      req.on('end', function () {
          let deleteArr = deleteData.split(",");
          console.log(deleteArr);

          for(var i=0; i<deleteArr.length;i++) {
              let temp = mongoose.Types.ObjectId(deleteArr[i]);
              WaterModel.remove({_id:temp}, function (error) {
                  if (error) {
                      console.error(error);
                  } else {
                      console.error("Delete Success!")
                  }
              })
          }
      });
      break;

    case '/css/style.css':
      sendFile(res, 'public/css/style.css', 'text/css')
      break

    case '/js/scripts.js':
      sendFile(res, 'public/js/scripts.js', 'text/javascript')
      break

    default:
      res.end('404 not found')
  }
})

server.listen(process.env.PORT || port);
console.log('listening on 8080')

function sendFile(res, filename, contentType) {
  contentType = contentType || 'text/html';

  fs.readFile(filename, function(error, content) {
    res.writeHead(200, {'Content-type': contentType})
    res.end(content, 'utf-8')
  })
}