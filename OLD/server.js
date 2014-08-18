//define ip and port to web service
var ip_server = '127.0.0.1:8585';

//includes web server modules
var server = require('webserver').create();

//start web server
var service = server.listen(ip_server, function(request, response) {


    console.log("We got some requset !!!"); 
    console.log("request method: ", request.method);  // request.method POST or GET 
    console.log("Get params: ",   request.url); //
        

    var links = [];
    var casper = require('casper').create();

    function getLinks() {
        var links = document.querySelectorAll('h3.r a');
        return Array.prototype.map.call(links, function(e) {
            return e.getAttribute('href')
        });
    }

    casper.start('http://google.fr/', function() {
        // search for 'casperjs' from google form
        this.fill('form[action="/search"]', { q: 'casperjs' }, true);
    });

    casper.then(function() {
        // aggregate results for the 'casperjs' search
        links = this.evaluate(getLinks);
        // now search for 'phantomjs' by filling the form again
        this.fill('form[action="/search"]', { q: 'phantomjs' }, true);
    });

    casper.then(function() {
        // aggregate results for the 'phantomjs' search
        links = links.concat(this.evaluate(getLinks));
    });

    //
    casper.run(function() {
            response.statusCode = 200;
            //sends results as JSON object
            response.write(JSON.stringify(links, null, null));
            response.close();              
    });

});
console.log('Server running at http://' + ip_server+'/');