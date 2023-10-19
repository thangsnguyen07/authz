import { Controller, Get } from '@nestjs/common'

import { M2MClientAccess, Permissions, Roles } from '@decorators'

import { TestService } from './test.service'

@Controller()
export class TestController {
  constructor(private readonly testService: TestService) {}

  @M2MClientAccess()
  @Roles(['ADMIN'])
  @Permissions(['read:admin'])
  @Get()
  getHello(): string {
    return this.testService.getHello()
  }
}
