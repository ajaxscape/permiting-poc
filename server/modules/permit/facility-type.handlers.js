const Cache = require('../../utils/cache')

const facilityTypes = [
  {
    value: 'installation',
    text: 'Installation',
    hint: {
      text: 'Facilities which carry out industrial processes like refineries, food and drink factories and intensive farming activities'
    }
  },
  {
    value: 'waste-operation',
    text: 'Waste operation',
    hint: {
      text: 'For example, transfer stations, waste treatment, recycling and composting'
    }
  },
  {
    value: 'landfill-and-deposit-for-recovery',
    text: 'Landfill and deposit for recovery'
  },
  {
    value: 'mining-waste-operation',
    text: 'Mining waste operation'
  },
  {
    value: 'mobile-plant–treatment-of-waste',
    text: 'Mobile plant – treatment of waste (other than land spreading)'
  },
  {
    value: 'water-discharge',
    text: 'Water discharge',
    hint: {
      text: 'For example, sewage, industrial or trade discharge, clearing water channels'
    }
  },
  {
    value: 'groundwater-activity',
    text: 'Groundwater activity'
  }
]

class FacilityTypeHandlers extends require('defra-hapi-handlers') {
  async facilityType (request) {
    const { facilityType } = await Cache.get(request, 'Application')
    return facilityType
  }

  // Overrides parent class handleGet
  async handleGet (request, h, errors) {
    const { facilityType } = await Cache.get(request, 'Application')

    this.viewData = {
      facilityTypes: facilityTypes.map((item) => {
        return {...item, checked: facilityType !== undefined && item.value === facilityType}
      })
    }

    return super.handleGet(request, h, errors)
  }

  // Overrides parent class handlePost
  async handlePost (request, h) {
    await Cache.update(request, 'Application', {
      facilityType: request.payload['facility-type']
    })
    return super.handlePost(request, h)
  }
}

module.exports = FacilityTypeHandlers
