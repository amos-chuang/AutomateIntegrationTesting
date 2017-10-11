var mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.Promise = require('bluebird');
var dbUri = 'mongodb://127.0.0.1:27017/aBot'
mongoose.connect(dbUri, { useMongoClient: true })
    .then(function() {
        console.log(dbUri + ' connect success');
    }, function(err) {
        console.log(dbUri + ' connect fail');
        console.log(err);
    });