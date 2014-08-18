//-- https://github.com/ariya/phantomjs/blob/master/examples/waitfor.js

function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
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



var system = require('system');
var page = require('webpage').create();
    
var headers = {
    "Content-Type": "application/json"
}


	var loadInProgress = false;
	var stepIndex = 0;
	var pageData = null;


  page.onLoadStarted = function() {
        loadInProgress = true;
        console.log("load started");
  };
       
  page.onLoadFinished = function() {    
        loadInProgress = false;
        console.log("load finished");
  };


 /* page.onResourceRequested = function (request) {
    system.stderr.writeLine('= onResourceRequested()');
    system.stderr.writeLine('  request: ' + JSON.stringify(request, undefined, 4));
	};
 
	page.onResourceReceived = function(response) {
	    system.stderr.writeLine('= onResourceReceived()' );
	    system.stderr.writeLine('  id: ' + response.id + ', stage: "' + response.stage + '", response: ' + JSON.stringify(response));
	};
 
	page.onLoadStarted = function() {

			loadInProgress = true;
	    system.stderr.writeLine('= onLoadStarted()');
	    var currentUrl = page.evaluate(function() {
	        return window.location.href;
	    });
	    system.stderr.writeLine('  leaving url: ' + currentUrl);
	};
 
	page.onLoadFinished = function(status) {

			loadInProgress = false;
	    system.stderr.writeLine('= onLoadFinished()');
	    system.stderr.writeLine('  status: ' + status);
	};
 
	page.onNavigationRequested = function(url, type, willNavigate, main) {
	    system.stderr.writeLine('= onNavigationRequested');
	    system.stderr.writeLine('  destination_url: ' + url);
	    system.stderr.writeLine('  type (cause): ' + type);
	    system.stderr.writeLine('  will navigate: ' + willNavigate);
	    system.stderr.writeLine('  from page\'s main frame: ' + main);
	};
	 
	page.onResourceError = function(resourceError) {
	    system.stderr.writeLine('= onResourceError()');
	    system.stderr.writeLine('  - unable to load url: "' + resourceError.url + '"');
	    system.stderr.writeLine('  - error code: ' + resourceError.errorCode + ', description: ' + resourceError.errorString );
	};
	 
	page.onError = function(msg, trace) {
	    system.stderr.writeLine('= onError()');
	    var msgStack = ['  ERROR: ' + msg];
	    if (trace) {
	        msgStack.push('  TRACE:');
	        trace.forEach(function(t) {
	            msgStack.push('    -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
	        });
	    }
	    system.stderr.writeLine(msgStack.join('\n'));
	};

*/


 var steps = [


		 				function() {

		 							page.settings.userAgent = "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1667.0 Safari/537.36";
		 							page.open('http://matrix.itasoftware.com/', function(status){

		 										// -- Use waitfor function !!! 
		 										    // waitFor(function() {

		 										    // 			//page.render('rendered_pageeee.png');		

		 										    // });


		 							});
		 							
		 				},

		 				function() {
		 							//page.render('steeep1111.png');		
		 				},

			 			function() {

			 			var server = 'http://matrix.itasoftware.com/xhr/shop/search'; 
			 						
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
                              "date": "2014-07-28",
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
                              "date": "2014-08-31",
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

						 var elasticRequest = 

						      		{ 
						              format: 'JSON', 
						              inputs: elasticQuery,
						              name: 'specificDates',
						              summarizers:  'carrierStopMatrix,currencyNotice,solutionList,itineraryPriceSlider,itineraryCarrierList,itineraryDepartureTimeRanges,itineraryArrivalTimeRanges,durationSliderItinerary,itineraryOrigins,itineraryDestinations,itineraryStopCountList,warningsItinerary'
						           } 

						
						 var postData = 'format=JSON&inputs='+elasticQuery+'&name=specificDates&summarizers=carrierStopMatrix,currencyNotice,solutionList,itineraryPriceSlider,itineraryCarrierList,itineraryDepartureTimeRanges,itineraryArrivalTimeRanges,durationSliderItinerary,itineraryOrigins,itineraryDestinations,itineraryStopCountList,warningsItinerary';

								//page.settings.userAgent = "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1667.0 Safari/537.36";
								
								page.open(server, 'post', postData , function (status) {

						    
								    if (status !== 'success') {

								        console.log('Unable to post!');

								    }else{
								        console.log(page.content);
								        pageData = page.content;
								    }


								    console.log(page.content);

								    //-- console.log(page.content);

								});


						}, 

						function() {

										console.log('get page data and  post back !!!');
										console.log(pageData);
						}

		]


	 //-- Worker !!!
   var interval = setInterval(function() {

   		// if(stepIndex === 3) {  phantom.exit();  }

      if (!loadInProgress && typeof steps[stepIndex] === "function") {
          
          console.log("Step N:  " + (stepIndex + 1));
          steps[stepIndex]();
          stepIndex++;
      }

      
      if(typeof steps[stepIndex] !== "function") {

          console.log('JOB FINISHED !!!');
          phantom.exit();
      }

   }, 1000);
  


// steps[0]();