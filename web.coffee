compression = require 'compression'
express = require 'express'
morgan = require 'morgan'
connect = require 'connect'
browserify = require 'browserify-middleware'
cc = require 'connect-coffee-script'

app = express()
app.use morgan 'dev'
app.use compression "#{__dirname}/dist"
app.set 'view engine', 'jade'
app.set 'views', './views'
app.use cc
    src : __dirname + '/coffee'
    dest : __dirname + '/public'

app.use '/textures', express.static __dirname + '/textures'

server = app.listen (process.env.PORT || 5000), () ->
  console.log(server.address())
  host = server.address().address
  port = server.address().port
  console.log("App listening at http://#{host}:#{port}")

app.get('/main.js', browserify(__dirname + '/public/main.js'))

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) ->
  res.render('index')
)

