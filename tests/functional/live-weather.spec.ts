import { test } from '@japa/runner'
import assert from 'assert'

test('updated weather data', async ({ client }) => {
  const response = await client.get('/api/live-weather')

  response.assertStatus(200)

  const responseData = response.body()
  assert(Array.isArray(responseData), 'Response data should be an array')

  responseData.forEach((cityData) => {
    assert(typeof cityData.city_id === 'number', 'city_id should be a number')
    assert(typeof cityData.max_temperature === 'number', 'max_temperature should be a number')
    assert(typeof cityData.min_temperature === 'number', 'min_temperature should be a number')
    assert(typeof cityData.wind_speed === 'number', 'wind_speed should be a number')
    assert(typeof cityData.rainfall_last_hour === 'number', 'rainfall_last_hour should be a number')
    assert(typeof cityData.updated_at === 'string', 'updated_at should be a string')
    assert(typeof cityData.city === 'string', 'city should be a string')
    assert(
      cityData.latitude === null || typeof cityData.latitude === 'string',
      'latitude should be null or a string'
    )
    assert(
      cityData.longitude === null || typeof cityData.longitude === 'string',
      'longitude should be null or a string'
    )
    assert(typeof cityData.gmt === 'number', 'gmt should be a number')
  })
})
