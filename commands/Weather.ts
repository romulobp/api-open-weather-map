import { BaseCommand, args } from '@adonisjs/core/build/standalone'

export default class Weather extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'weather'

  public static description = 'update weather data'

  @args.spread({ required: false, description: 'City ID' })
  public cityId: string[]

  /**
   * Command description is displayed in the "help" output
   */

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest`
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  private check(id: string): number {
    const convertedId = Number(id)
    if (isNaN(convertedId)) {
      throw new Error(`City ID's must be numbers. Received: ${id}`)
    }
    return convertedId
  }

  public async run() {
    const { default: WeatherService } = await import('App/Services/WeatherService')

    const ids = this.cityId.map((id) => this.check(id))

    await WeatherService.update(ids)
  }
}
