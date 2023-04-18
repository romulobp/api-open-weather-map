import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class WeatherData extends BaseSchema {
  protected tableName = 'weathers'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('city_id').unsigned().references('id').inTable('cities').onDelete('CASCADE')
      table.timestamp('downloaded_at', { useTz: true }).notNullable()
      table.float('temperature').notNullable()
      table.float('max_temperature').notNullable()
      table.float('min_temperature').notNullable()
      table.float('wind_speed').notNullable()
      table.dateTime('sunrise', { useTz: true }).notNullable()
      table.dateTime('sunset', { useTz: true }).notNullable()
      table.float('rainfall_last_hour')

      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
