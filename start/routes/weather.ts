import Route from '@ioc:Adonis/Core/Route'

Route.get('/live-weather', 'WeatherController.live').prefix('api')
