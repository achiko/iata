var fs = require('fs');
var utils = require('utils');



//-- define ip and port to web service
var ip_server = '127.0.0.1:8585';

//-- includes web server modules
var server = require('webserver').create();

//-- start web server
var service = server.listen(ip_server, function(request, response) {

    console.log("Get url Data: ");
    console.log(request.url);
    
    var params = request.url.split('=');
    console.log('Params 1 === ',  params[1]);

    var requestedUrl = params[1];
    
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

        casper.start(requestedUrl, function() {
            this.emit("Site.loaded", this.getTitle());
            casper.capture("content/screenshot.png");        
        });


        casper.then(function() {
                pagedata = this.page.content;
        });
  

        casper.run(function() {
                response.statusCode = 200;
                //response.write(JSON.stringify({message: "ok"}, null, null));
                response.write(pagedata);
                response.close();              
        });

});

console.log('Server running at http://' + ip_server+'/');