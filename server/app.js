// Generated by CoffeeScript 1.10.0
(function() {
  var app, bodyParser, config, cookieParser, cors, express, favicon, io, listenHttp, listenHttps, open, path, ref, routes, serverHttp, serverHttps, socketIdsInRoom, sslOptions;

  express = require('express');

  app = express();

  cors = require('cors');

  favicon = require('serve-favicon');

  open = require('open');

  path = require('path');

  cookieParser = require('cookie-parser');

  bodyParser = require('body-parser');

  ref = require('./config'), config = ref[0], sslOptions = ref[1];

  console.log("configuration: " + JSON.stringify(config, null, 4));

  routes = require('./routes/index')(express, config);

  app.set('views', path.join(__dirname, 'views'));

  app.set('view engine', 'jade');

  app.use(cors());

  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({
    extended: false
  }));

  app.use(cookieParser());

  app.use(require('stylus').middleware(path.join(__dirname, 'public')));

  app.use(favicon(path.join(__dirname, 'public', 'favicon.ppm')));

  app.use('/.well-known', express["static"](path.join(__dirname, '.well-known')));

  app.use(express["static"](path.join(__dirname, 'public')));

  app.use('/', routes);

  listenHttp = function(config) {
    var http, serverHttp;
    http = require('http');
    serverHttp = http.createServer(app);
    if (config.httpIp) {
      return serverHttp.listen(config.httpPort, config.httpIp, function() {
        console.log("Secure SSL (HTTPS) server running on address " + config.httpIp + ":" + config.httpPort);
        return serverHttp;
      });
    } else {
      return serverHttp.listen(config.httpPort, function() {
        console.log("Secure SSL (HTTPS) server running on port " + config.httpPort);
        return serverHttp;
      });
    }
  };

  listenHttps = function(config, sslOptions) {
    var https, serverHttps;
    https = require('https');
    serverHttps = https.createServer(sslOptions, app);
    return serverHttps.listen(config.httpsPort, function() {
      console.log("HTTP server running on port " + config.httpsPort);
      return serverHttps;
    });
  };

  if (config.env === 'local') {
    serverHttp = listenHttp(config);
    serverHttps = listenHttps(config, sslOptions);
  } else if ((config.heroku != null)) {
    if (sslOptions != null) {
      serverHttps = listenHttps(config, sslOptions);
    } else {
      serverHttp = listenHttp(config);
    }
  } else {
    serverHttp = listenHttp(config);
  }

  io = require('socket.io')(serverHttps);

  socketIdsInRoom = function(name) {
    var collection, key, socketIds;
    socketIds = io.nsps['/'].adapter.rooms[name];
    if (socketIds) {
      collection = [];
      for (key in socketIds) {
        collection.push(key);
      }
      return collection;
    } else {
      return [];
    }
  };

  io.on('connection', function(socket) {
    socket.on('disconnect', function() {
      var room;
      if (socket.room) {
        room = socket.room;
        io.to(room).emit('leave', socket.id);
        socket.leave(room);
      }
    });
    socket.on('join', function(name, callback) {
      var socketIds;
      socketIds = socketIdsInRoom(name);
      callback(socketIds);
      socket.join(name);
      socket.room = name;
    });
    return socket.on('exchange', function(data) {
      var to;
      data.from = socket.id;
      to = io.sockets.connected[data.to];
      to.emit('exchange', data);
    });
  });

}).call(this);

//# sourceMappingURL=app.js.map
