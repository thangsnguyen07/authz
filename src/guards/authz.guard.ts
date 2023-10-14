import { CurrentUser, RequestContext, UtilService } from '@charliexndt/common'
import { Observable } from 'rxjs'

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

import { M2MClientId, Permissions, Roles } from '@decorators'

@Injectable()
export class AuthzGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector, private utilService: UtilService) {
    super()
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const user: CurrentUser = RequestContext.currentUser()

    if (!user) {
      return false
    }

    // Check auth0 m2m client id
    const m2mClientId = this.reflector.get(M2MClientId, context.getHandler())
    const userClientId = user.clientId
    const isClientCredentials = user.isClientCredentials

    console.log(m2mClientId, userClientId, isClientCredentials)

    // If user has m2m client id, check if it matches auth0 client id
    if (m2mClientId && m2mClientId.length > 0) {
      if (isClientCredentials) {
        return m2mClientId === userClientId
      }
    }

    // Check valid roles
    const roles = this.reflector.get(Roles, context.getHandler())

    if (roles && user?.roles && !this.utilService.arraysEqual(roles, user.roles)) {
      return false
    }

    // Check valid permissions
    const permissions = this.reflector.get(Permissions, context.getHandler())

    if (
      permissions &&
      user?.permissions &&
      !this.utilService.arraysEqual(permissions, user.permissions)
    ) {
      return false
    }

    return true
  }
}
