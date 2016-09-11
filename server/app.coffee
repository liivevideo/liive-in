express = require('express')
app = express()
cors = require('cors')
favicon = require('serve-favicon')
open = require('open')
path = require('path')
#logger = require('morgan')
cookieParser = require('cookie-parser')
bodyParser = require('body-parser')
[config, sslOptions] = require('./config')
console.log("configuration: "+JSON.stringify(config, null, 4))

routes = require('./routes/index')(express, config)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(require('stylus').middleware(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ppm')))
app.use('/.well-known', express.static(path.join(__dirname, '.well-known'))) # lets encrypt cert verification.
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', routes)

listenHttp = (config) ->
  http = require('http')
  serverHttp = http.createServer(app)
  if config.httpIp
    serverHttp.listen(config.httpPort, config.httpIp, () ->
      console.log("Secure SSL (HTTPS) server running on address #{config.httpIp}:#{config.httpPort}")
      return serverHttp
    )
  else
    serverHttp.listen(config.httpPort, () ->
      console.log("Secure SSL (HTTPS) server running on port #{config.httpPort}")
      return serverHttp
    )
listenHttps = (config, sslOptions) ->
  https = require('https')
  serverHttps = https.createServer(sslOptions, app)
  serverHttps.listen(config.httpsPort, () ->
    console.log("HTTP server running on port #{config.httpsPort}", )
    return serverHttps
  )

if (config.env=='local')
  serverHttp = listenHttp(config)
  serverHttps = listenHttps(config, sslOptions)
else if (config.heroku?)
  if sslOptions?
    serverHttps = listenHttps(config, sslOptions)
  else
    serverHttp = listenHttp(config)
else
  serverHttp = listenHttp(config)

io = require('socket.io')(serverHttps)

socketIdsInRoom = (name) ->
#  console.log("ids in room..."+name)
  socketIds = io.nsps['/'].adapter.rooms[name]
#  console.log("sockets:"+JSON.stringify(socketIds))
  if (socketIds)
    collection = []
    for key of socketIds
      collection.push(key)

#    console.log("ids: "+JSON.stringify(collection))
    return collection
  else
    return []

io.on('connection', (socket) ->
#  console.log('connection')
  socket.on('disconnect', () ->
#    console.log('disconnect')
    if (socket.room)
      room = socket.room
      io.to(room).emit('leave', socket.id)
      socket.leave(room)
    return
  )
  socket.on('join', (name, callback) ->
#    console.log('join', name)
    socketIds = socketIdsInRoom(name)
    callback(socketIds)
    socket.join(name)
    socket.room = name
    return
  )
  socket.on('exchange', (data) ->
#    console.log('exchange', data)
    data.from = socket.id
    to = io.sockets.connected[data.to]
    to.emit('exchange', data)
    return
  )
)


