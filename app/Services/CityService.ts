import Database from '@ioc:Adonis/Lucid/Database'
import City from 'App/Models/City'

export default class CityService {
  public static async update(city: City): Promise<City> {
    const trx = await Database.transaction()
    try {
      const cityInstance = await City.findOrFail(city.id, { client: trx })
      cityInstance.merge(city)
      await cityInstance.save()
      await trx.commit()
      return City.findOrFail(city.id)
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
}
