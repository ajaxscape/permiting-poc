const hapi = require('@hapi/hapi')
const { name, version } = require('../package')
const { logger } = require('defra-logging-facade')

const port = 3000

const serverOptions = {
  port: port,
  routes: {
    validate: {
      options: {
        abortEarly: false
      }
    }
  }
}

async function registerPlugins (server) {
  await server.register([
    require('@hapi/inert'),
    require('./plugins/frontend'),
    require('./plugins/version'),
    require('./plugins/flow'),
    require('./plugins/robots'),
    require('./plugins/cache'),
    require('./plugins/error-pages'),
    require('./plugins/crumb'),
    require('./plugins/logging'),
    require('blipp')
  ])
}

function startHandler (server) {
  logger.info(`${name} (${version}) is starting...`)

  // listen on SIGTERM signal and gracefully stop the server
  process.on('SIGTERM', function () {
    logger.info('Received SIGTERM scheduling shutdown...')
    logger.info(`${name} (${version}) is stopping...`)

    server.stop({ timeout: 10000 }).then(function (err) {
      logger.info('Shutdown complete')
      process.exit((err) ? 1 : 0)
    })
  })
}

async function createServer () {
  // Create the hapi server
  const server = hapi.server(serverOptions)

  // Register the plugins
  await registerPlugins(server)

  server.events.on('start', () => startHandler(server))

  return server
}

module.exports = createServer
