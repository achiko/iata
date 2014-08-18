    //var page = new WebPage()
    //var page = require('webpage'), testindex = 0,   loadInProgress = false

    function waitFor(testFx, onReady, timeOutMillis) {
        var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 15000, //< Default Max Timout is 3s
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


    var page = new WebPage(), testindex = 0, loadInProgress = false;

     
      page.onConsoleMessage = function(msg) {
        console.log(msg);
      };
       
      page.onLoadStarted = function() {
        loadInProgress = true;
        console.log("load started");
      };
       
      page.onLoadFinished = function() {
        loadInProgress = false;
        console.log("load finished");
      };
        
    
      phantom.cookiesEnabled = true;
  

        var steps = [
          
              function() {

                  console.log("Default Page !");
                  page.settings.userAgent = "'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:12.0) Gecko/20100101 Firefox/12.0';";
                  page.open("http://localhost:3000/");

              },
              
              // function() {
                   
              //   page.evaluate(function() {
              //        console.log(document.title);
              //    });
              // },

              function() {

                  page.open('http://www.google.com');

                  // var  server = 'http://localhost:3000/api/jobs';
                  // var  data = '{"universe": "expanding", "answer": 42}';

                  // var headers = {
                  //     "Content-Type": "application/json"
                  // }

                  // page.open(server, 'post', data, headers, function (status) {
                  //     if (status !== 'success') {
                  //         console.log('Unable to post!');
                  //     } else {
                  //         console.log(page.content);
                  //     }
                  // });

              }
        ]
         

        var interval = setInterval(function() {

          console.log(typeof steps[testindex]); 


          if (!loadInProgress && typeof steps[testindex] === "function") {
              
              console.log("Step N:  " + (testindex + 1));
              steps[testindex]();
              testindex++;
          }


          if(typeof steps[testindex] !== "function") {

              console.log(typeof steps[testindex]); 
              console.log('JOB  FINISHED !!!');
              phantom.exit();
          }

       }, 300);
      





