import Env from '@ioc:Adonis/Core/Env'
import City from 'App/Models/City'

export default class OpenWeather {
  public static apiKey: string = Env.get('OPEN_WEATHER_API_KEY')
  public static apiUrl: string = Env.get('OPEN_WEATHER_BASE_URL')

  public static async fetchByOpenWeatherId(cityIds: number[]): Promise<Response> {
    try {
      const response = await fetch(
        `${this.apiUrl}/group?id=${cityIds.join(',')}&appid=${this.apiKey}&units=metric`
      )

      return response
    } catch (error) {
      throw new Error(error)
    }
  }

  public static async fetchByLatLong(city: City): Promise<Response> {
    try {
      const response = await fetch(
        `${this.apiUrl}/weather?lat=${city.latitude}&lon=${city.longitude}&appid=${this.apiKey}&units=metric`
      )
      return response
    } catch (error) {
      throw new Error(error)
    }
  }

  public static async fetchByName(city: City): Promise<Response> {
    try {
      const response = await fetch(
        `${this.apiUrl}/weather?q=${city.name}&appid=${this.apiKey}&units=metric`
      )
      return response
    } catch (error) {
      throw new Error(error)
    }
  }
}
