import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import City from 'App/Models/City'
import Database from '@ioc:Adonis/Lucid/Database'

export default class CitySeeder extends BaseSeeder {
  public async run () {
    await Database.transaction(async (trx) => {
      await City.createMany(
        [
          {
            name: 'Santa Maria',
            latitude: '-29.6841666667',
            longitude: '-53.8069444444',
            gmt: -3
          },
          {
            name: 'Campo Grande',
            latitude: '-20.4427777778',
            longitude: '-54.6463888889',
            gmt: -4
          },
          {
            name: 'Deutsch Jahrndorf',
            latitude: '48.0086111111',
            longitude: '17.1097222222',
            gmt: 2
          },
          {
            name: 'Três de Maio',
            latitude: null,
            longitude: null,
            gmt: -3
          }
        ],
        { client: trx }
      )
    })
  }
}
