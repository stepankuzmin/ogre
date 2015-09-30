var fs        = require('fs'),
    path      = require('path'),
    http      = require('http'),
    npid      = require('npid'),
    express   = require('express'),
    ogr2ogr   = require('ogr2ogr'),
    minimist  = require('minimist')

args = minimist(process.argv.slice(2))

if (args.pid) {
  try {
    pid = npid.create(args.pid)
    pid.removeOnExit()
  }
  catch (error) {
    console.error('can not digest %s', args.pid)
    console.error(error.message)
    process.exit(-1)
  }
}

var app = express()

// Set headers
app.use(function (request, response, next) {
  response.header('Access-Control-Allow-Origin', '*')
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  console.log('%s: %s',  new Date().toISOString(), request.url)
  next()
})

// ogr2ogr handler
app.get('/', function (request, response, next) {
  var input       = request.query.input,
      output      = request.query.output,
      format      = (request.query.format || 'GeoJSON'),
      projection  = (request.query.projection || 'EPSG:4326')

  if (!fs.existsSync(input)) {
    response.status(400).json({ error: 'nothing to eat' })
    return
  }

  try {
    ogr2ogr(input).project(projection)
                  .format(format)
                  .skipfailures()
                  .stream()
                  .pipe(fs.createWriteStream(output))
  }
  catch (error) {
    response.status(400).json({ error: 'can not eat that' })
    return
  }

  response.status(200).json({ output: output })
})

handler = args.socket || args.port || 3000
var server = http.createServer(app).listen(handler, function () {
  if (args.socket) fs.chmodSync(args.socket, '1766')
  var address = JSON.stringify(server.address())
  console.log('The Ogre is listening at %s', address)
})

// Catch SIGINT (Ctrl+C) to kill the Ogre
process.on('SIGINT', function () {
  console.warn('You have just killed the Ogre!')
  server.close()
  process.exit()
})