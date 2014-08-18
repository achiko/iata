var path = require('path')
var childProcess = require('child_process')
var phantomjs = require('phantomjs')
var binPath = phantomjs.path
var fs = require('fs');



var childArgs = [
   path.join(__dirname, 'test.js'),
   'http://www.kayak.com/flights/TBS-STR/2014-09-02/2014-09-28', 'imagefile'
]


childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
      

        console.log('stdout', stdout);

        var log = fs.createWriteStream('content/page.html', {'flags': 'a'});
        log.end(stdout + "\n" );

        //console.log('stderr', stderr);

})

