// Run with casperjs   --cookies-file=tmpk.txt 
// jshint strict:false
// global CasperError, console, phantom, require*/

var fs = require('fs');
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
    
    logLevel: "debug",         //debug    // Only "info" level messages will be logged
    verbose: true              // log messages will be printed out to the console
});

var xpath = require('casper').selectXPath;


casper.userAgent('Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1667.0 Safari/537.36');
phantom.cookiesEnabled = true;
var cookies = fs.read('tmpk.txt');


casper.start("http://wizzair.com/", function() {
    // emitting a custom event
    this.emit("site.loaded", this.getTitle());

     this.echo('Browser Cookie: ' + this.evaluate(function() {
        return document.cookie;
    }));

    // f = fs.open("cookies.txt", "w");
    // f.writeLine(phantom.cookies);
    // f.close();
    
});

// casper.viewport(1920, 1080).then(function() {
//     // new view port is now effective
// });

// Listening on site loaded event 
casper.on("site.loaded", function(title) {

     casper.capture("content/wizcasper.png");  // Capture 

     this.echo('Page title is: ' + this.evaluate(function() {
        return document.title;

    }), 'INFO'); // Will be printed in green on the console

    //var str = JSON.stringify(phantom.cookies, null, 2);       
});


// Fill Send From City 
casper.then(function() {
    	
    //this.sendKeys(".city-from", "Kutaisi (Georgia) (KUT)");
    
 });

// Fill To City WAW - is warsaw ...
casper.then(function() {
 
    this.sendKeys(".city-to", "WAW", {keepFocus: false}); 

});


// Find in Autocomplete list 
casper.wait(2000, function() { 
    casper.then(function() {     
        this.click('.box-autocomplete .wrap .group .selected');     
    });
});

// 
casper.wait(3000, function(){
    casper.then(function() {     
         this.click('.validation-message-pax-placeholder');         
    });
});


casper.wait(3000, function(){
    this.click(xpath('//*[@id="ControlGroupRibbonAnonHomeView_AvailabilitySearchInputRibbonAnonHomeView_ButtonSubmit"]'), function(e){                    
             this.echo("Submit Button Has been clicked !!!");           
     });
});




//*[@id="marketColumn0"]/p[2]/a

casper.wait(20000, function(){
    casper.capture("content/wizcasperFinal.png");            
});         



casper.run();

// casper.run(function() {    
//     this.test.renderResults(true);
// });