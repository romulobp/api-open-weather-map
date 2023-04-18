import Route from '@ioc:Adonis/Core/Route'

import Database from '@ioc:Adonis/Lucid/Database'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import './routes/city'
import './routes/weather'

Route.get('db-health', async ({ response }: HttpContextContract) => {
  await Database.report().then(({ health }) => {
    const { healthy, message } = health
    if (healthy) return response.ok({ message })
    return response.status(500).json({ message })
  })
}).prefix('api')

Route.get('/', async () => {
  return { hello: 'world' }
})
