import { BaseTask } from 'adonis5-scheduler/build'
import WeatherService from 'App/Services/WeatherService'
import Logger from '@ioc:Adonis/Core/Logger'

export default class WeatherTask extends BaseTask {
  public static get schedule() {
    return '30 * * * * '
  }

  public static get useLock() {
    return false
  }

  public async handle() {
    try {
      Logger.info('WeatherTask.handle - Call')
      await WeatherService.update()
      Logger.info('WeatherTask.handle - Success')
    } catch (error) {
      Logger.error(`WeatherTask.handle - Error: ${error.message}`)
    }
  }
}
