/*jshint strict:false*/
/*global CasperError, console, phantom, require*/

var utils = require('utils');


  var casper = require("casper").create({
      verbose: true
  });


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


   casper.open( 'http://localhost:3000/api/jobs' , elasticRequest, function (response) {
      
          // //dump response header          
          // this.echo('Dump response : ');
          // //this.echo(this.page);
          // utils.dump(response);
    }); 


// casper.open('http://localhost:3000/api/jobs', elasticRequest,  function(response){
    
//     if(respons.status == 200){
//         utils.dump(this.page.content);
//     }


// });


casper.run();