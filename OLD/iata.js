// Run with casperjs   --cookies-file=tmpk.txt 
// jshint strict:false
// global CasperError, console, phantom, require*/

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

            //var test = utils.dump(data);
            //-- utils.dump({plop: 42});

            //utils.dump(this.page.content);

            //var test = JSON.stringify(resource);
            //fs.write('log.txt', this.page.content, 'a'); 

            //casper.echo(  utils.dump(JSON.stringify(resource)) ); 
    }

});

//- Sniff then resource requested 
casper.on('resource.requested', function(requestData, request) {

    if (requestData.url === 'http://matrix.itasoftware.com/xhr/shop/search') {        
        

                    capser.open('http://matrix.itasoftware.com/xhr/shop/search', {
                    method: 'post',
                    data: {
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
                              "date": "2014-07-21",
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

                }, function(response) {

                        if(respons.status == 200){
                            utils.dump(this.page.content);
                        }
                });

    }

    //casper.echo(  requestData.url );
});



// Fill Send From City 
casper.then(function() {
    this.sendKeys("#advancedfrom1", "TBS");    
 });

// Fill To City 
casper.then(function() {
    this.sendKeys("#advancedto1", "WAW", { keepFocus: false }); 
});


//-- Date From: #advanced_rtDeparture
casper.then(function() {
    this.sendKeys("#advanced_rtDeparture", "7/21/2014"); 
});

//-- Date To: #advanced_rtReturn
casper.then(function() {
    this.sendKeys("#advanced_rtReturn", "7/31/2014"); 
});


//--- Capture filled form !!!

//-- Click Search Button: #advanced_searchSubmitButton or  xpath //*[@id="advanced_searchSubmitButton"]
casper.wait(2000, function(){

    this.click(xpath('//*[@id="advanced_searchSubmitButton"]'), function(e){       
             this.echo("Submit Button Has been clicked !!!");           
     });
});


//-- 
casper.wait(35000, function(){

    casper.capture("content/wizcasperFinal.png");        
    fs.write('finalpage.html', this.page.content, 'w');

});         




casper.run();

// casper.run(function() {    
//     this.test.renderResults(true);
// });