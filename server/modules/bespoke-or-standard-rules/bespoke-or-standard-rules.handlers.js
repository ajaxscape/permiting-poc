const Cache = require('../../utils/cache')

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
    const { permitType } = await Cache.get(request, 'Application')
    return permitType
  }

  // Overrides parent class handleGet
  async handleGet (request, h, errors) {
    const { permitType } = await Cache.get(request, 'Application')

    this.viewData = {
      permitTypes: permitTypes.map((item) => {
        return {...item, checked: permitType !== undefined && item.value === permitType}
      })
    }

    return super.handleGet(request, h, errors)
  }

  // Overrides parent class handlePost
  async handlePost (request, h) {
    await Cache.update(request, 'Application', {
      permitType: request.payload['permit-type']
    })
    return super.handlePost(request, h)
  }
}

module.exports = BespokeOrStandardRulesHandlers
