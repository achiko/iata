var LineByLineReader = require('line-by-line');
var mongoose    = require('mongoose');


mongoose.connect('mongodb://localhost/iata');
var db = mongoose.connection;


 var rep = function(n) {

      return   n.replace('"','').replace('"', '')
}

//-- "iata";"type";"name";"coordinates";"timezone";"parent_name"
var Airlines = mongoose.model('Airlines', 
    { 
        iata: String,
        type: String,
        name: String,
        coord: String,
        timezone:  String, 
        parent_name: String,
        fullname : String
    });

var lr = new LineByLineReader('airports.csv');
lr.on('error', function (err) {
    // 'err' contains error object
});

var a = 0;

lr.on('line', function (line) {
  
    console.log(line);
    var arr = line.split(';');

     var ob = new Airlines({

          iata          : rep(arr[0]),
          type          : rep(arr[1]),
          name          : rep(arr[2]),
          coord         : rep(arr[3]),
          timezone      : rep(arr[4]),
          parent_name   : rep(arr[5]),

          fullname:  rep( rep(arr[5]) + ' , ' + rep(arr[2]) + ' , ' + rep(arr[0]) )

    });
     
    ob.save();
    


    // console.log(line);
    // a += 1;
    // var  nameline = new Models.names({      
    //       _NameID: a,
    //              _Name: line,
    //     _isUsed: 0  
    //     });
    // nameline.save(function(err, res){  });

});

lr.on('end', function () {
    // All lines are read, file is closed now.
    //console.log(count);
});