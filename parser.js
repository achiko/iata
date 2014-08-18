var cheerio    = require('cheerio');
var request    = require('request');
var inspect    = require('eyespect').inspector();
var util       = require('util');
var fs         = require('fs');


String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
};


request({ uri: "http://localhost:5000/" },  function(error, response, body) {

        if(error) {
            inspect(error, 'error');
            return console.log(error);
        }


        var $ = cheerio.load(body);

         var Data = [];
        //console.log($);

        $('div[class="inner"]').each(function(key, value){

              console.log("/-------------------------------------------------------------------------------/");
              var div = $(this);

              var price         = div.children("div").children("div").children("div").children("a").text().trim();
              var airlineImage  = div.children("div").children("[class*='rightCol']").children("[class*=maindatacell]").children("img").attr("src"); 
              var airlineDiv    = div.children("div").children("[class*='rightCol']").children("[class*=airlineAndLegs]").children("[class*='airlineName']");
              
              //-- From
              var   DepartureAirportName  = null;
              var   DepartureTime         = null;
              var   ArrivalAirport        = null;
              var   ArrivalTime           = null;

              //-- Back
              var   DepartureAirportName1  = null;
              var   DepartureTime1         = null;
              var   ArrivalAirport1        = null;
              var   ArrivalTime1           = null;

              //-- legholder --//
              var legholderDiv = div.children("div").children("[class*='rightCol']").children("[class*=airlineAndLegs]").children("[class*='legholder']");
              
              legholderDiv.children("[class*=singleleg]").each(function(k, v) {

                      var pricline = $(v);

                      if(k === 0) {

                             //-- console.log(util.inspect( $(pricline.children("div")[4]).html() , { colors: true } ) );
                             DepartureAirportName = $(pricline.children("div")[1]).attr("title");
                             DepartureTime        = $(pricline.children("div")[2]).text().trim();

                             ArrivalAirport = $(pricline.children("div")[4]).attr("title");
                             ArrivalTime    = $(pricline.children("div")[5]).text().trim();

                             console.log("From: -----------------------------------------------------------")
                             console.log("Departure : ", DepartureAirportName, ' Dep time: ', DepartureTime);
                             console.log("Arrival : ",  ArrivalAirport, ' Arr time: ', ArrivalTime);
                      }

                      if(k === 2) {

                             //-- console.log(util.inspect( $(pricline.children("div")[4]).html() , { colors: true } ) );

                             DepartureAirportName1 = $(pricline.children("div")[1]).attr("title");
                             DepartureTime1        = $(pricline.children("div")[2]).text().trim();

                             ArrivalAirport1 = $(pricline.children("div")[4]).attr("title");
                             ArrivalTime1    = $(pricline.children("div")[5]).text().trim();

                             console.log("Back : -----------------------------------------------------------")
                             console.log("Departure : ", DepartureAirportName1, ' Dep time: ', DepartureTime1);
                             console.log("Arrival : ",  ArrivalAirport1, ' Arr time: ', ArrivalTime1);
                      }

              });


             
              Data.push(
                    {
                        price: price,
                        airlineImage: airlineImage,
                        
                        DepartureAirportName :  DepartureAirportName,
                        DepartureTime        :  DepartureTime,
                        ArrivalAirport       :  ArrivalAirport,
                        ArrivalTime          :  ArrivalTime,

                        DepartureAirportName1 :  DepartureAirportName1,
                        DepartureTime1        :  DepartureTime1,
                        ArrivalAirport1       :  ArrivalAirport1,
                        ArrivalTime1          :  ArrivalTime1,

                    }
              );



              //console.log(legholderDiv.html() );
              //console.log("/-------------------------------------------------------------------------------/");


        });


        var log = fs.createWriteStream('log.txt', {'flags': 'a'});
        log.end(util.inspect( Data ) + "\n" );



});