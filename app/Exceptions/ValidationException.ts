import { Exception } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ValidationException extends Exception {
  public code = 'E_VALIDATION_FAILURE'

  constructor(message: string, status: number = 400) {
    super(message, status)
  }

  public async handle(error: this, ctx: HttpContextContract) {
    ctx.logger.error(`ValidationException - ${error.message}`)
    return ctx.response.status(error.status).send({
      code: error.code,
      message: 'Validation Error',
      errors: JSON.parse(error.message),
      status: error.status,
    })
  }
}
