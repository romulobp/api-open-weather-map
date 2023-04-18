import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Weather from 'App/Models/Weather'

export default class City extends BaseModel {
  public serializeExtras = true

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public latitude: string | null

  @column()
  public longitude: string | null

  @column()
  public gmt: number

  @column()
  public openWeatherMapId: number | null

  @hasMany(() => Weather)
  public weather: HasMany<typeof Weather>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
