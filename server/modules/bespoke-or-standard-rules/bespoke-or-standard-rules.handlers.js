const { Cache } = require('defra-hapi-utils')

const permitTypes = [
  {
    value: 'standard-rules',
    text: 'Standard rules'
  },
  {
    value: 'bespoke',
    text: 'Bespoke'
  }
]

class BespokeOrStandardRulesHandlers extends require('defra-hapi-handlers') {
  async permitType (request) {
    const application = await Cache.get(request, 'Application')
    return application.permitType
  }

  // Overrides parent class handleGet
  async handleGet (request, h, errors) {
    const application = await Cache.get(request, 'Application')
    const { permitType } = application

    this.viewData = {
      application,
      permitTypes: permitTypes.map((item) => {
        return {...item, checked: permitType !== undefined && item.value === permitType}
      })
    }

    return super.handleGet(request, h, errors)
  }

  // Overrides parent class handlePost
  async handlePost (request, h) {
    const application = await Cache.get(request, 'Application')
    application.permitType = request.payload['permit-type']
    await Cache.set(request, 'Application', application)
    return super.handlePost(request, h)
  }
}

module.exports = BespokeOrStandardRulesHandlers
