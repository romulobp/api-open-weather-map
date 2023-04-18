import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CityUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional({}, [rules.minLength(2), rules.maxLength(50)]),
    latitude: schema.string.optional({}, [rules.minLength(2), rules.maxLength(15)]),
    longitude: schema.string.optional({}, [rules.minLength(2), rules.maxLength(15)]),
    gmt: schema.number.optional(),
    openWeatherMapId: schema.number.optional(),
  })

  public messages: CustomMessages = {
    'name.minLength': 'O campo nome precisa ter pelo menos 2 caracteres.',
    'name.maxLength': 'O campo nome não pode ter mais de 50 caracteres.',
    'latitude.minLength': 'O campo latitude precisa ter pelo menos 2 caracteres.',
    'latitude.maxLength': 'O campo latitude não pode ter mais de 15 caracteres.',
    'longitude.minLength': 'O campo longitude precisa ter pelo menos 2 caracteres.',
    'longitude.maxLength': 'O campo longitude não pode ter mais de 15 caracteres.',
  }
}
