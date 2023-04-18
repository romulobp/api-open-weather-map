import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public async ready(): Promise<void> {
    const scheduler = this.app.container.use('Adonis/Addons/Scheduler')
    scheduler.run()
  }
}
