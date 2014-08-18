// Run with casperjs   --cookies-file=tmpk.txt 
// jshint strict:false
// global CasperError, console, phantom, require */

var fs = require('fs');
var utils = require('utils');


var casper = require("casper").create({
    
    // clientScripts:  
    // [
    //     //'jquery.js'      // These two scripts will be injected in remote
    //     //'underscore.js'   // DOM on every request
    // ],
    
    pageSettings: {
        loadImages:  true,        // The WebPage instance used by Casper will
        loadPlugins: true         // use these settings
    },
    
    logLevel: "debug",         // debug    // Only "info" level messages will be logged
    verbose: true              // log messages will be printed out to the console
});

var xpath = require('casper').selectXPath;


casper.userAgent('Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1667.0 Safari/537.36');
phantom.cookiesEnabled = true;

//var cookies = fs.read('tmpk.txt');


casper.start("http://matrix.itasoftware.com/", function() {
    // emitting a custom event
    this.emit("site.loaded", this.getTitle());

     this.echo('Browser Cookie: ' + this.evaluate(function() {
        return document.cookie;
    }));

     f = fs.open("cookies.txt", "w");
     f.writeLine(phantom.cookies);
     f.close();
    
});

// casper.viewport(1920, 1080).then(function() {
//     // new view port is now effective
// });

// Listening on site loaded event 
casper.on("site.loaded", function(title) {

     casper.capture("content/iata1.png");  // Capture 
     this.echo('Page title is: ' + this.evaluate(function() {        
        return document.title;
    }), 'INFO'); // Will be printed in green on the console

    //var str = JSON.stringify(phantom.cookies, null, 2);       
});


// Sniff recived resources !!!
casper.on('resource.received', function(resource) {
    
    if(resource.url === 'http://matrix.itasoftware.com/xhr/shop/search') 
    {
          //fs.write('log.txt', resource + '\n' , 'a');
          casper.echo(resource.url);
          casper.echo(  utils.dump(JSON.stringify(resource)) ); 
    }

});

//- Sniff then resource requested 
casper.on('resource.requested', function(requestData, request) {

   if (requestData.url === 'http://matrix.itasoftware.com/xhr/shop/search') {        
        
        casper.echo('matrix Search requested !'); 
   }
    //casper.echo(  requestData.url );
});


casper.then( function() {
    // the next var is very specific to ElasticSearch
    var elasticQuery = JSON.stringify (
      
               {
                          "slices": [
                            {
                              "origins": [
                                "TBS"
                              ],
                              "originPreferCity": false,
                              "destinations": [
                                "WAW"
                              ],
                              "destinationPreferCity": false,
                              "date": "2014-07-25",
                              "isArrivalDate": false,
                              "dateModifier": {
                                "minus": 0,
                                "plus": 0
                              }
                            },
                            {
                              "destinations": [
                                "TBS"
                              ],
                              "destinationPreferCity": false,
                              "origins": [
                                "WAW"
                              ],
                              "originPreferCity": false,
                              "date": "2014-07-31",
                              "isArrivalDate": false,
                              "dateModifier": {
                                "minus": 0,
                                "plus": 0
                              }
                            }
                          ],
                          "pax": {
                            "adults": 1
                          },
                          "cabin": "COACH",
                          "changeOfAirport": true,
                          "checkAvailability": true,
                          "page": {
                            "size": 30
                          },
                          "sorts": "default"

                }
    );

    var elasticRequest = {
      method: 'POST',   
      data: { 
              format: 'JSON', 
              inputs: elasticQuery,
              name: 'specificDates',
              summarizers:  'carrierStopMatrix,currencyNotice,solutionList,itineraryPriceSlider,itineraryCarrierList,itineraryDepartureTimeRanges,itineraryArrivalTimeRanges,durationSliderItinerary,itineraryOrigins,itineraryDestinations,itineraryStopCountList,warningsItinerary'
            } 

    }

    this.thenOpen( 'http://matrix.itasoftware.com/xhr/shop/search' , elasticRequest, function (response) {
      
          //dump response header
          
          this.echo('Dump response : ');
          utils.dump(response);
          fs.write('log1.txt', response + '\n' , 'a');

          //echo response body
          this.echo('Page Contect : ');
          this.echo(this.page.content);

          //echo response body with no tags added (useful for JSON)
          this.echo('This PlainText : ');
          this.echo(this.page.plainText);

    }); 


});





casper.run();

// casper.run(function() {    
//     this.test.renderResults(true);
// });