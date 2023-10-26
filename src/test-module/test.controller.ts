import { Auth0Service } from 'src/services/auth0/auth0.service'

import { Controller, Get } from '@nestjs/common'

import { M2MClientAccess, Permissions, Roles } from '@decorators'

import { TestService } from './test.service'

@Controller()
export class TestController {
  constructor(
    private readonly testService: TestService,
    private readonly auth0Service: Auth0Service
  ) {}

  @M2MClientAccess()
  @Roles(['ADMIN'])
  @Permissions(['read:admin'])
  @Get()
  async getHello(): Promise<any> {
    try {
      return this.auth0Service.getM2MToken()
    } catch (error) {
      console.log(error)
    }
  }
}
