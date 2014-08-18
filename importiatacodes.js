var mongoose      = require('mongoose');
var ElasticSearchClient = require('elasticsearchclient');
var _             = require('underscore');
var fs = require("fs");
var util          = require('util');



var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: '162.243.113.228:9200',
  log: 'trace'
});


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



  Airlines.find({}, function(err, docs){
        
        console.log(docs.length);

        //for (var i = 1; i <  docs.length -1 ;  i++) {
        for (var i = 16999 ; i <  18620 ;  i++) {
          
              //console.log(docs[i]);
              console.log('=====================================');
              addElastic(i, docs[i]);
        };

  });



  addElastic = function(id, doc) {

      // index a document
      client.index({
        index: 'iata',
        type: 'airlines',
        id: id,
        body: {
         
            iata        : doc.iata,
            type        : doc.type,
            name        : doc.name,
            coord       : doc.coordinates,
            timezone    : doc.timezone,
            parent_name : doc.parent_name,
            fullname    : doc.fullname,

        }
      }, function (err, resp) {
        
            if(err) {

                console.log(err);
            }

            //console.log(resp);
      });

  }