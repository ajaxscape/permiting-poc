const pkg = require('../../package.json')

module.exports = {
  plugin: require('hapi-govuk-frontend'),
  options: {
    assetPath: '/assets',
    assetDirectories: ['public/static', 'public/build'],
    serviceName: 'Front end template demo',
    viewPath: 'server/modules',
    context: {
      appVersion: pkg.version
    }
  }
}
