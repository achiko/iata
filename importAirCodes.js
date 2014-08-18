var LineByLineReader = require('line-by-line');
var mongoose    = require('mongoose');

 //-- Mongo DB 
 mongoose.connect('mongodb://localhost/cashpot');
 var db = mongoose.connection;

 //-- DB Models
var Models = require('./lib/Models/Models.js')(mongoose); 



var rownumber  = _.random(0, 5000);
console.log('RowNumber: ', rownumber);

db.names.find({_isUsed: false }).limit(-1).skip(13).next()



// var lr = new LineByLineReader('names.csv');

// lr.on('error', function (err) {
//     // 'err' contains error object
// });

// var a = 0;

// lr.on('line', function (line) {
    
//     // 'line' contains the current line without the trailing newline character.
//     //console.log(line);
//     a += 1;
//     var  nameline = new Models.names({      
//           _NameID: a,
//                  _Name: line,
//         _isUsed: 0  
//         });

//     nameline.save(function(err, res){  });

// });

// lr.on('end', function () {
//     // All lines are read, file is closed now.
//     //console.log(count);
// });