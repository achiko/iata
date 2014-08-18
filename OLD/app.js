var request 	= require("request");
var j 				= request.jar();
var fs 				= require('fs');
var util			= require('util');
var inspect 	= require('eyespect').inspector();


inspect('Hi !!!');
  

    // var siteoptions = {
    //       url: "http://matrix.itasoftware.com/",
    //       method: 'GET',
    //       headers: {

    //           "Accept"            : "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    //           "Accept-Encoding"   : "gzip,deflate,sdch",
    //           "Accept-Language"   : "en-US,en;q=0.8,bg;q=0.6,de;q=0.4,fr;q=0.2,ka;q=0.2,nl;q=0.2,ru;q=0.2,sv;q=0.2,tr;q=0.2,uk;q=0.2",
    //           "User-Agent"        : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0",
    //       }
    // }

    
    //  request(siteoptions, function (err, response, body) {
      
    //   if (err) {
    //       inspect(err, 'error');
    //       return
    //   }

    //   var headers     = response.headers
    //   var statusCode  = response.statusCode
      
    //     inspect(headers, 'headers');
    //     inspect(statusCode, 'statusCode');
    //     inspect(body, 'body');

    // });



     
    // var elasticQuery = JSON.stringify (
      
    //            {
    //                       "slices": [
    //                         {
    //                           "origins": [
    //                             "TBS"
    //                           ],
    //                           "originPreferCity": false,
    //                           "destinations": [
    //                             "WAW"
    //                           ],
    //                           "destinationPreferCity": false,
    //                           "date": "2014-07-25",
    //                           "isArrivalDate": false,
    //                           "dateModifier": {
    //                             "minus": 0,
    //                             "plus": 0
    //                           }
    //                         },
    //                         {
    //                           "destinations": [
    //                             "TBS"
    //                           ],
    //                           "destinationPreferCity": false,
    //                           "origins": [
    //                             "WAW"
    //                           ],
    //                           "originPreferCity": false,
    //                           "date": "2014-07-31",
    //                           "isArrivalDate": false,
    //                           "dateModifier": {
    //                             "minus": 0,
    //                             "plus": 0
    //                           }
    //                         }
    //                       ],
    //                       "pax": {
    //                         "adults": 1
    //                       },
    //                       "cabin": "COACH",
    //                       "changeOfAirport": true,
    //                       "checkAvailability": true,
    //                       "page": {
    //                         "size": 30
    //                       },
    //                       "sorts": "default"

    //             }
    // );

    // var elasticRequest = {

    //       format: 'JSON', 
    //       inputs: elasticQuery,
    //       name: 'specificDates',
    //       summarizers:  'carrierStopMatrix,currencyNotice,solutionList,itineraryPriceSlider,itineraryCarrierList,itineraryDepartureTimeRanges,itineraryArrivalTimeRanges,durationSliderItinerary,itineraryOrigins,itineraryDestinations,itineraryStopCountList,warningsItinerary'

    // }

    // var postData = 'format=JSON&inputs='+elasticQuery+'&name=specificDates&summarizers=carrierStopMatrix,currencyNotice,solutionList,itineraryPriceSlider,itineraryCarrierList,itineraryDepartureTimeRanges,itineraryArrivalTimeRanges,durationSliderItinerary,itineraryOrigins,itineraryDestinations,itineraryStopCountList,warningsItinerary';


    // var options = {

    //     url         : "http://matrix.itasoftware.com/xhr/shop/search",
    //     method      : 'POST',
    //     body        : postData,
    //     headers: {
    //         "Accept"            : "*/*",
    //         "User-Agent"        : "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36",
    //         "Accept-Encoding"   : "gzip,deflate,sdch",
    //         "Accept-Language"   : "en-US,en;q=0.8,bg;q=0.6,de;q=0.4,fr;q=0.2,ka;q=0.2,nl;q=0.2,ru;q=0.2,sv;q=0.2,tr;q=0.2,uk;q=0.2",
    //         "X-Requested-With"  : "XMLHttpRequest"
    //     },
    //     jar: j
    // }


    // request(options, function (err, response, body) {
      
    //   if (err) {
    //     inspect(err, 'error posting: ');
    //     return
    //   }

    //   var headers 		= response.headers
    //   var statusCode 	= response.statusCode
      
    //     inspect(headers, 'headers');
    //     inspect(statusCode, 'statusCode');
    //     inspect(body, 'body');

    //     console.log(body);

    // });






  var options = {

 				url: "http://www.kayak.com/flights/TBS-BER/2014-08-27/2014-09-10",
		    method: 'get',		    
		    json: true,
		    headers: {
        		"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0"
    		},
    		jar: j
	  }


request(options, function (err, response, body) {
  
  var cookie_string = j.getCookieString(options.url); // "key1=value1; key2=value2; ..."
  var cookies       = j.getCookies(options.url); 

  // inspect(cookie_string);
  // inspect("===============================");
  // inspect(cookies);

    inspect(response.headers, 'headers; ');
    inspect(response.statusCode, 'Status Code: ');

    inspect(body, 'body');


		var log = fs.createWriteStream('kayak.html', {'flags': 'a'}); 
	  log.end( body + "\n");							 							 			

  
});

