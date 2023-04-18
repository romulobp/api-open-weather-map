import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import City from 'App/Models/City'

export default class Weather extends BaseModel {
  public serializeExtras() {
    return {
      downloadedAt: this.$extras.downloadedAt,
      city: this.$extras.name,
      temperature: this.$extras.temperature,
      maxTemperature: this.$extras.maxTemperature,
      minTemperature: this.$extras.minTemperature,
      windSpeed: this.$extras.windSpeed,
      sunrise: this.$extras.sunrise,
      sunset: this.$extras.sunset,
      rainfallLastHour: this.$extras.rainfallLastHour,
      latitude: this.$extras.latitude,
      longitude: this.$extras.longitude,
      gmt: this.$extras.gmt,
    }
  }

  @column({ isPrimary: true })
  public id: number

  @column()
  public cityId: number

  @belongsTo(() => City)
  public city: BelongsTo<typeof City>

  @column.dateTime()
  public downloadedAt: DateTime

  @column()
  public temperature: number

  @column()
  public maxTemperature: number

  @column()
  public minTemperature: number

  @column()
  public windSpeed: number

  @column.dateTime()
  public sunrise: DateTime

  @column.dateTime()
  public sunset: DateTime

  @column()
  public rainfallLastHour: number | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
