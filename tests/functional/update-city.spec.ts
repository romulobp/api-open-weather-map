import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('City', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('update a city', async ({ client, assert }) => {
    const updatedData = {
      name: 'Teste',
      latitude: '1234',
      longitude: '5678',
      gmt: -3,
      openWeatherMapId: 123456,
    }

    const response = await client.patch(`/api/city/1`).json(updatedData)

    response.assertStatus(200)

    assert.equal(response.body().name, updatedData.name)
    assert.equal(response.body().latitude, updatedData.latitude)
    assert.equal(response.body().longitude, updatedData.longitude)
    assert.equal(response.body().gmt, updatedData.gmt)
    assert.equal(response.body().open_weather_map_id, updatedData.openWeatherMapId)
  })
})
