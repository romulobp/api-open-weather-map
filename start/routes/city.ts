import Route from '@ioc:Adonis/Core/Route'

Route.patch('/city/:id', 'CityController.update').prefix('api')
