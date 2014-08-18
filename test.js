///-- console.log('Hello, world! From PhantomJS ');

var args = require('system').args;
var page = require('webpage').create();
var fs = require('fs');



function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 20000, //< Default Max Timout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 250); //< repeat check every 250ms
};



//-- get passed arguments

var url     = args[1];
var guid    = args[2];


phantom.cookiesEnabled = true;
page.settings.userAgent = "'Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1667.0 Safari/537.36'";


page.open(url, function (s) {

    page.injectJs("jquery.js");



     waitFor(function() {

            var that = this;

            // Check in the page if a specific element is now visible
            return page.evaluate(function() {
                
                //console.log($('[class*=bookitselect ]').length);
                //return $('[class*=bookitselect ]').is(":visible");            
                
                return !$('#progressDiv').is(":visible");            

                // if( $('[class*=bookitselect ]').length > 12 ) {
                //         return true;
                // }

            });

        }, function() {

            //console.log("The Page should be visible now !!!");
            page.render('content/'+guid+'.png');

            try {
                    fs.write('content/'+ guid+'.txt' , page.content, 'w');
                    //fs.write('content/log.tst' , that.testmessage, 'w');

                } catch(e) {

                 console.log(e);
            }

            console.log('ok !')
            phantom.exit();

        });        


});
