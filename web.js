(function() {
  var app, browserify, cc, compression, connect, express, morgan, server;

  compression = require('compression');

  express = require('express');

  morgan = require('morgan');

  connect = require('connect');

  browserify = require('browserify-middleware');

  cc = require('connect-coffee-script');

  app = express();

  app.use(morgan('dev'));

  app.use(compression(__dirname + "/dist"));

  app.set('view engine', 'jade');

  app.set('views', './views');

  app.use(cc({
    src: __dirname + '/coffee',
    dest: __dirname + '/public'
  }));

  app.use('/textures', express["static"](__dirname + '/textures'));

  server = app.listen(process.env.PORT || 5000, function() {
    var host, port;
    console.log(server.address());
    host = server.address().address;
    port = server.address().port;
    return console.log("App listening at http://" + host + ":" + port);
  });

  app.get('/main.js', browserify(__dirname + '/public/main.js'));


  /*
  app.get('/*.mp3', (req, res) ->
    res.sendFile(__dirname + '/public/*.mp3')
  )
   */

  app.use(express["static"](__dirname + '/public'));

  app.get('/', function(req, res) {
    return res.render('index');
  });

}).call(this);
