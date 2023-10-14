import { Controller, Get } from '@nestjs/common'

import { M2MClientId } from './decorators/m2m-client-id.decorator'
import { Permissions } from './decorators/permissions.decorator'
import { Roles } from './decorators/roles.decorator'
import { TestService } from './test.service'

@Controller()
export class TestController {
  constructor(private readonly testService: TestService) {}

  @M2MClientId(process.env.AUTH0_M2M_CLIENT_ID)
  // @M2MClientId('DCsi0Y3Q4iaJXeFNdeesnsBWJS8axDVT')
  @Roles(['ADMIN'])
  @Permissions(['read:admin'])
  @Get()
  getHello(): string {
    console.log(process.env)

    return this.testService.getHello()
  }
}
