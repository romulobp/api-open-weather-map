import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'

import CityService from 'App/Services/CityService'
import City from 'App/Models/City'
import CityUpdateValidator from 'App/Validators/CityUpdateValidator'
import ValidationException from 'App/Exceptions/ValidationException'
import InternalServerException from 'App/Exceptions/InternalServerException'

export default class CityController {
  public async update({ request, response }: HttpContextContract) {
    Logger.info('CityController.update - Call')
    await request.validate(CityUpdateValidator)

    const city = request.body() as City
    Object.assign(city, { id: request.param('id') })

    try {
      const update = await CityService.update(city)
      Logger.info('CityController.update - Success')
      response.status(200).json(update)
    } catch (error) {
      if (error.code === 'E_VALIDATION_FAILURE') {
        throw new ValidationException(JSON.stringify(error.messages))
      } else {
        throw new InternalServerException(error.message)
      }
    }
  }
}
