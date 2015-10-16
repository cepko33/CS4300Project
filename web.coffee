compression = require 'compression'
express = require 'express'
morgan = require 'morgan'

app = express()
app.use morgan 'dev'
app.use compression "#{__dirname}/dist"
server = app.listen (process.env.PORT || 5000), () ->
  console.log(server.address())
  host = server.address().address
  port = server.address().port
  console.log("App listening at http://#{host}:#{port}")

app.get('/', (req, res) ->
  res.send('Hello World')
)

