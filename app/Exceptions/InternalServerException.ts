import { Exception } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class InternalServerException extends Exception {
  public code = 'E_INTERNAL_SERVER_ERROR'

  constructor(message: string, status: number = 500) {
    super(message, status)
  }

  public async handle(error: this, ctx: HttpContextContract) {
    ctx.logger.error(`InternalServerException - ${error.message}`)
    return ctx.response.status(error.status).send({
      code: error.code,
      message: 'Internal Server Error',
      status: error.status,
    })
  }
}
