import { DateTime } from 'luxon'
import Database from '@ioc:Adonis/Lucid/Database'
import Logger from '@ioc:Adonis/Core/Logger'

import OpenWeather from 'App/Integrations/OpenWeather'
import CityService from './CityService'
import City from 'App/Models/City'
import Weather from 'App/Models/Weather'
import { WeatherDataResponse } from 'App/Types/WeatherRequest'

export default class WeatherService {
  public static async update(cityIds?: number[]): Promise<void> {
    Logger.info('WeatherService.update - Call')
    try {
      const cities = await this.getCities(cityIds)

      if (cities.length === 0) {
        Logger.warn('WeatherService.update - No cities found')
        return
      }

      const weatherData = await this.fetchWeatherDataForCities(cities)
      await this.saveWeatherData(weatherData)
      Logger.info('WeatherService.update - Success')
    } catch (error) {
      Logger.error(`WeatherService.update - Error: ${error.message}`)
    }
  }

  public static async getCities(cityIds?: number[]): Promise<City[]> {
    return City.query()
      .select('id', 'name', 'latitude', 'longitude', 'gmt', 'openWeatherMapId')
      .where((query) => {
        if (cityIds && cityIds.length > 0) {
          query.whereIn('id', cityIds)
        }
      })
  }

  public static cityTime(gmt: number, timestamp?: number): DateTime {
    const now = timestamp ? timestamp : Date.now()
    const utcTimestamp = now + new Date().getTimezoneOffset() * 60 * 1000
    const adjustedTimestamp = utcTimestamp + gmt * 60 * 60 * 1000
    return DateTime.fromMillis(adjustedTimestamp)
  }

  public static async fetchWeatherDataForCities(cities: City[]): Promise<Weather[]> {
    const citiesWithOpeanWeatherId = cities.filter((city) => city.openWeatherMapId)
    const citiesWithLatLong = cities.filter(
      (city) => city.latitude && city.longitude && !city.openWeatherMapId
    )
    const citiesWithoutData = cities.filter(
      (city) => !city.latitude && !city.longitude && !city.openWeatherMapId && city.name
    )

    const weatherDataById = await this.fetchWeatherDataById(citiesWithOpeanWeatherId)
    const weatherDataByLatLong = await this.fetchWeatherDataByLatLong(citiesWithLatLong)
    const weatherDataWithoutData = await this.fetchWeatherDataWithoutData(citiesWithoutData)

    return [...weatherDataById, ...weatherDataByLatLong, ...weatherDataWithoutData].filter(
      (data): data is Weather => data !== undefined
    )
  }

  private static async fetchWeatherDataById(cities: City[]): Promise<Weather[]> {
    const response = await OpenWeather.fetchByOpenWeatherId(
      cities.map((city) => city.openWeatherMapId!)
    )
    return this.processWeatherResponses(cities, response)
  }

  private static async fetchWeatherDataByLatLong(cities: City[]): Promise<Weather[]> {
    const weatherPromises = cities.map(async (city) => {
      const response = await OpenWeather.fetchByLatLong(city)
      return this.processWeatherResponse(city, response)
    })

    const weatherData = await Promise.all(weatherPromises)
    return weatherData.filter((data): data is Weather => data !== undefined)
  }

  private static async fetchWeatherDataWithoutData(cities: City[]): Promise<Weather[]> {
    const weatherPromises = cities.map(async (city) => {
      const response = await OpenWeather.fetchByName(city)
      return this.processWeatherResponse(city, response)
    })

    const weatherData = await Promise.all(weatherPromises)
    return weatherData.filter((data): data is Weather => data !== undefined)
  }

  private static async processWeatherResponse(
    city: City,
    response: Response
  ): Promise<Weather | undefined> {
    try {
      if (response?.ok) {
        const data = await response.json()
        if (!city.openWeatherMapId) {
          Object.assign(city, { openWeatherMapId: data.id })
          await CityService.update(city)
        }
        return this.formatWeatherData(city, data)
      }
    } catch (error) {
      Logger.error(`WeatherService.processWeatherResponse - Error: ${error.message}`)
    }
  }

  private static async processWeatherResponses(
    cities: City[],
    response: Response
  ): Promise<Weather[]> {
    const weatherData: Weather[] = []
    if (response?.ok) {
      const data = await response.json()
      data.list.forEach((data: WeatherDataResponse) => {
        const city = cities.find((city) => city.openWeatherMapId === data.id)
        if (city !== undefined) {
          weatherData.push(this.formatWeatherData(city, data))
        }
      })
    }
    return weatherData
  }

  private static formatWeatherData(city: City, data: WeatherDataResponse): Weather {
    const weatherData = {
      cityId: city.id,
      downloadedAt: this.cityTime(city.gmt, new Date().getTime()),
      temperature: data.main.temp,
      maxTemperature: data.main.temp_max,
      minTemperature: data.main.temp_min,
      windSpeed: data.wind.speed,
      sunrise: this.cityTime(city.gmt, data.sys.sunrise * 1000),
      sunset: this.cityTime(city.gmt, data.sys.sunset * 1000),
      rainfallLastHour: data.rain?.['1h'] ?? 0,
    }

    const weather = new Weather()
    Object.assign(weather, weatherData)

    return weather
  }

  private static async saveWeatherData(weatherData: Weather[]): Promise<void> {
    const trx = await Database.transaction()
    try {
      await Weather.createMany(weatherData, { client: trx })
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      Logger.error(`WeatherService.saveWeatherData - Error: ${error.message}`)
    }
  }

  public static async updatedWeather(): Promise<Weather[]> {
    const subquery = await Weather.query()
      .select('cityId')
      .max('downloaded_at as downloaded_at')
      .groupBy('cityId')

    const query = await Weather.query()
      .select(
        'city_id',
        'temperature',
        'maxTemperature',
        'minTemperature',
        'windSpeed',
        'sunrise',
        'sunset',
        'rainfallLastHour',
        'c.name',
        'c.latitude',
        'c.longitude',
        'c.gmt',
        'weathers.downloaded_at as updated_at'
      )
      .whereIn(
        ['city_id', 'downloaded_at'],
        subquery.map((weather) => [
          weather.cityId,
          new Date(
            weather.downloadedAt.year,
            weather.downloadedAt.month - 1,
            weather.downloadedAt.day,
            weather.downloadedAt.hour,
            weather.downloadedAt.minute,
            weather.downloadedAt.second,
            weather.downloadedAt.millisecond
          ),
        ])
      )
      .join('cities as c', 'c.id', 'weathers.city_id')
      .orderBy('c.name', 'asc')

    return query
  }
}
