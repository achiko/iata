// Run with casperjs   --cookies-file=tmpk.txt 
// jshint strict:false
// global CasperError, console, phantom, require */

var fs = require('fs');
var utils = require('utils');


//-- define ip and port to web service
var ip_server = '127.0.0.1:8585';

//-- includes web server modules
var server = require('webserver').create();

//-- start web server
var service = server.listen(ip_server, function(request, response) {

    console.log("POST params should be next: ");
    console.log('Request Post: ',  JSON.stringify(request.post)); //dump
    console.log('Post Data 1 :',  request[0] );
    //-- console.log('Post Data 2 :', request.post['2']);
    

    var casper = require("casper").create({
        pageSettings: {
            loadImages:  true,        // The WebPage instance used by Casper will
            loadPlugins: true         // use these settings
        },
        // logLevel: "debug",         // debug  // Only "info" level messages will be logged
        // verbose: true              // log messages will be printed out to the console
    });

    var xpath = require('casper').selectXPath;
    var pagedata = "";

    casper.userAgent('Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1667.0 Safari/537.36');
    phantom.cookiesEnabled = true;

            casper.start("http://www.kayak.com/flights/WAW-NYC/2014-08-31/2014-09-08", function() {
                
                // emitting a custom event
                this.emit("site.loaded", this.getTitle());

                // this.echo('Browser Cookie: ' + this.evaluate(function() {
                //     return document.cookie;
                // }));

                //casper.capture("content/kayak.png");        
                
            });

            //-- Listening on site loaded event 
            /*casper.on("site.loaded", function(title) {

                 this.echo('Page title is: ' + this.evaluate(function() {        
                    return document.title;
                }), 'INFO'); 

                casper.capture("content/kaiak.png");  // Capture 

            });*/

            //-- Sniff recived resources !!!
           /* casper.on('resource.received', function(resource) {
                    //casper.echo(resource.url);
            });
            */
            //-- Sniff then resource requested 
            /*  casper.on('resource.requested', function(requestData, request) {

            });
            */

                /*
                    casper.wait(12000, function(){
                        //-- casper.capture("content/kayaaaaaaaaaaaaaaaaaak.png");        
                        //fs.write('www/kayak.html', this.page.content, 'w');
                    });       

                */


             casper.then(function() {

                    pagedata = this.page.content;
            });
      



            //casper.run();
            // casper.run(function() {    
            //     this.test.renderResults(true);
            // });

        casper.run(function() {
                    response.statusCode = 200;
                    //sends results as JSON object
                    response.write(JSON.stringify({message: "ok"}, null, null));
                    //response.write(pagedata);
                    response.close();              
        });


});

console.log('Server running at http://' + ip_server+'/');