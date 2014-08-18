var express       = require('express')  , http = require('http')  , path = require('path');
var _             = require('underscore');
var inspect       = require('eyespect').inspector();
var util          = require('util');
var bodyParser    = require('body-parser');
var request       = require('request');
var cheerio       = require('cheerio');
var fs            = require('fs');
var mongoose      = require('mongoose');

var ElasticSearchClient = require('elasticsearchclient');


var childProcess  = require('child_process')
var phantomjs     = require('phantomjs')
var binPath       = phantomjs.path

var app = express();

///  elasticsearch  

var serverOptions = {
    hosts:[{
            host: 'localhost',
            port: 9200
          }]
};

var elasticSearchClient = new ElasticSearchClient(serverOptions);


//-- Mongo DB
mongoose.connect('mongodb://localhost/iata');
var db = mongoose.connection;

var Airlines = mongoose.model('Airlines', 
    { 
        iata: String,
        type: String,
        name: String,
        coord: String,
        timezone:  String, 
        parent_name: String,
        fullname : String
    });


var logs = mongoose.model('logs', {



});


//-- App Configure !!!
app.set('view engine', 'html');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/www'));

uuid = function(a) {
    if (a) {
      return (a ^ Math.random() * 16 >> a / 4).toString(16);
    } else {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[108]/g, uuid);
    }
};


//-- Main Page  

app.get('/', function(req, res) {

      return res.sendfile(__dirname + '/www/main.html');
});


//-- For testing
app.get('/doc', function(req, res) {

      return res.sendfile(__dirname + '/www/kayak.html');
});




//-- elasticsearch  
app.get('/api/iatasearch/', function(req, res){

    inspect(req.query.query);
    
    var querydsl = {
                      "query": {  
                          "prefix" : { 
                              "fullname" : "" 
                            }
                      }
                }

    // var querydsl = {

    //           "query": { 
      
    //               "match" : {
    //                   "fullname" : ""
    //               }
    //           }
    //     }


   // var querydsl =  {

   //            "query": {
   //              "bool": {
   //                "must": [
   //                  {
   //                    "query_string": {
   //                      "default_field": "_all",
   //                      "query": ""
   //                    }
   //                  }
   //                ],
   //                "must_not": [
                    
   //                ],
   //                "should": [
                    
   //                ]
   //              }
   //            },
   //            "from": 0,
   //            "size": 30,
   //            "sort": [
                
   //            ],
   //            "facets": {
                
   //            }
   //          }

    querydsl.query.prefix.fullname = (req.query.query).toLowerCase();

    // querydsl.query.bool.must[0].query_string.query = req.query.query;

    inspect(querydsl);

    // Creat result object
    var result = {"query": "Unit", "suggestions": [] }

    elasticSearchClient.search('iata', 'airlines', querydsl)
            .on('data', function(data) {
                
                var elasticsresult  = JSON.parse(data);
              
                _.each(elasticsresult.hits.hits, function(item){
                  
                       result.suggestions.push({ value: item._source.fullname, data: item._source.iata })
                });

                res.send(result);

            })
            .on('done', function(){
                //always returns 0 right now
            })
            .on('error', function(error){
                console.log(error);
                res.send(result);
            })
            .exec()

});


app.get('/api/iatasearch_old/', function(req, res){

    //inspect(req.params.name, 'REQUESTED WORD: '); 
    inspect(req.query.query);

    //-- db.users.find({"name": /.*m.*/})
    // var w =   '/.*' + req.params.name + '.*/';
    // var w = /tbs/

     var w =   '^' + req.query.query;
   // var w =   '^tbilisi';

    inspect(w);

    var query = Airlines.find( {'parent_name': { $regex: w, $options: 'i' }  }).limit(10);

    var obj = {
            // Query is not required as of version 1.2.5
            "query": "Unit",
            "suggestions": [
                { "value": "United Arab Emirates", "data": "AE" },
                { "value": "United Kingdom",       "data": "UK" },
                { "value": "United States",        "data": "US" }
            ]
      }


    var result = {"query": "Unit", "suggestions": [] }

    return  query.exec(function(error, docs){

            if(!error){

              _.each(docs, function(item){
                  result.suggestions.push({ value: item.fullname, data: item.iata })
              });

               console.log(result);
               return res.send(result);
              

            }else{          
              return console.log(error); 
              //res.send('Error!!!');
            }  
      });

});

app.post('/api/search', function(req, res){

    console.log( req.body );
    var reqdata = req.body;

    var url = "http://www.kayak.com/flights/"+ reqdata.from + "-" + reqdata.to +"/" + reqdata.dtfrom + "/" + reqdata.dtto;
    console.log(url);
    //-- generate uid
    var uid = uuid();
    //-- Declare Search Object 
    var searchObject = {};
    //-- Script name to exec, search url , uuid()
    var childArgs = [
       path.join(__dirname, 'test.js'), url, uid
    ]
    
    /*
     fs.readFile('content/c0b74aff-f8ca-4a50-ac97-0a0eb10ba1d8.txt', 'utf8', function (err, data) { 

                if (err) { 
                    return res.send( { message: "error" });
                }

                 //-- parse data 
                 pasreData(data, req.body,  function(err, response){    

                    //-- Build Search Object For admin
                    searchObject.uid    = uid;
                    searchObject.query  = reqdata;
                    searchObject.url    = url;
                    //searchObject.botresponse = stdout;

                    console.log(searchObject, 'Searchobject For admin: ');

                    return  res.json(response);

                }); //-- eof parse data

      }); //-- eof fs read 
    */

    
    //-- call phantom 
    childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
          if(err) {  console.log('Bot Error: ', err);   }

          console.log('Bot Response: ', stdout );

          //-- read generated file 
          //-- temporary Commnetd
          fs.readFile('content/'+uid+'.txt', 'utf8', function (err, data) { 

                if (err) { 
                    return res.send( { message: "error" });
                }

                 //-- parse data 
                 pasreData(data, req.body , function(err, response){    

                    //-- Build Search Object For admin
                    searchObject.uid    = uid;
                    searchObject.query  = reqdata;
                    searchObject.url    = url;
                    searchObject.botresponse = stdout;

                    console.log(searchObject, 'Searchobject For admin: ');

                    return  res.json(response);

                }); //-- eof parse data

          }); //-- eof fs read 

    }); //-- eof child process

  

});


var pasreData = function(body, searchobj,  calback) {

        var $ = cheerio.load(body);

        var result = { 
                      
                      message: "succsess", 
                      search: searchobj, 
                      data:  [] 

                    }

        //console.log($);

        $('div[class="inner"]').each(function(key, value){

              //console.log("/-------------------------------------------------------------------------------/");
              var div = $(this);

              var price          = div.children("div").children("div").children("div").children("a").text().trim();
              

              var airlineImage   = div.children("div").children("[class*='rightCol']").children("[class*=maindatacell]").children("img").attr("src"); 
              var airlineName    = div.children("div").children("[class*='rightCol']").children("[class*=airlineAndLegs]").children("[class*='airlineName']").text().trim();

            
              
              //-- From
              var   DepartureAirportName  = null;
              var   DepartureTime         = null;
              var   ArrivalAirport        = null;
              var   ArrivalTime           = null;
              var   Duration = null;

              //-- Back
              var   DepartureAirportName1  = null;
              var   DepartureTime1         = null;
              var   ArrivalAirport1        = null;
              var   ArrivalTime1           = null;
              var   Duration1 = null;

              //-- legholder --//
              var legholderDiv = div.children("div").children("[class*='rightCol']").children("[class*=airlineAndLegs]").children("[class*='legholder']");
             

              
              legholderDiv.children("[class*=singleleg]").each(function(k, v) {

                      var pricline = $(v);

                       var log = fs.createWriteStream('log.txt', {'flags': 'a'});
                       log.end( util.inspect( $(pricline.children("div")[6]).text().trim()  ) + "\n" );

                      if(k === 0) {

                             //-- console.log(util.inspect( $(pricline.children("div")[4]).html() , { colors: true } ) );
                             DepartureAirportName = $(pricline.children("div")[1]).attr("title");
                             DepartureTime        = $(pricline.children("div")[2]).text().trim();

                             ArrivalAirport = $(pricline.children("div")[4]).attr("title");
                             ArrivalTime    = $(pricline.children("div")[5]).text().trim();

                             Duration =  $(pricline.children("div")[6]).text().trim();
                             // console.log("From: -----------------------------------------------------------")
                             // console.log("Departure : ", DepartureAirportName, ' Dep time: ', DepartureTime);
                             // console.log("Arrival : ",  ArrivalAirport, ' Arr time: ', ArrivalTime);
                      }

                      if(k === 2) {

                             //-- console.log(util.inspect( $(pricline.children("div")[4]).html() , { colors: true } ) );

                             DepartureAirportName1 = $(pricline.children("div")[1]).attr("title");
                             DepartureTime1        = $(pricline.children("div")[2]).text().trim();

                             ArrivalAirport1 = $(pricline.children("div")[4]).attr("title");
                             ArrivalTime1    = $(pricline.children("div")[5]).text().trim();

                             Duration1 =  $(pricline.children("div")[6]).text().trim();


                             // console.log("Back : -----------------------------------------------------------")
                             // console.log("Departure : ", DepartureAirportName1, ' Dep time: ', DepartureTime1);
                             // console.log("Arrival : ",  ArrivalAirport1, ' Arr time: ', ArrivalTime1);
                      }

              });


             
              result.data.push(
                    {
                        price: price.replace(/\D/g, ''),
                        airlineImage: airlineImage,
                        airlineName : airlineName,
                        
                        DepartureAirportName :  DepartureAirportName,
                        DepartureTime        :  DepartureTime,
                        ArrivalAirport       :  ArrivalAirport,
                        ArrivalTime          :  ArrivalTime,
                        Duration             :  Duration,

                        DepartureAirportName1 :  DepartureAirportName1,
                        DepartureTime1        :  DepartureTime1,
                        ArrivalAirport1       :  ArrivalAirport1,
                        ArrivalTime1          :  ArrivalTime1,
                        Duration1             :  Duration1,

                    }
              );

              //console.log(legholderDiv.html() );
              //console.log("/-------------------------------------------------------------------------------/");

        });


        inspect(result);

        calback(null, result);    
}



var port = process.env.PORT || 5000;

app.listen(5000, function() {
    inspect("Listening on " + port);
});