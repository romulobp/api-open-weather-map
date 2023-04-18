import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'

import WeatherService from 'App/Services/WeatherService'
import InternalServerException from 'App/Exceptions/InternalServerException'
export default class WeathersController {
  public async live({ response }: HttpContextContract) {
    Logger.info('WeathersController.live - Call')
    try {
      const res = await WeatherService.updatedWeather()

      Logger.info('WeathersController.live - Success')

      return response.status(200).json(res)
    } catch (error) {
      throw new InternalServerException(error.message)
    }
  }
}
