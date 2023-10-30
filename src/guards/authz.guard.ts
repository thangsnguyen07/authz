import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

import { CurrentUser, RequestContext, UtilService } from '@charliexndt/common'

import { AuthModuleOptions } from '@interfaces'

import {
  AUTH_MODULE_OPTIONS,
  M2M_CLIENT_ACCESS_DECORATOR_METADATA_KEY,
  PERMISSIONS_DECORATOR_METADATA_KEY,
  PUBLIC_DECORATOR_METADATA_KEY,
  ROLES_DECORATOR_METADATA_KEY,
} from '@constants'

@Injectable()
export class AuthzGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS) private authModuleOptions: AuthModuleOptions,
    private reflector: Reflector,
    private utilService: UtilService
  ) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if request is public
    const isPublic = this.reflector.get(PUBLIC_DECORATOR_METADATA_KEY, context.getHandler())

    if (isPublic) {
      return true
    }

    // Check jwt auth
    const isVerified = await super.canActivate(context)

    if (!isVerified) {
      return false
    }

    const user: CurrentUser = RequestContext.currentUser()

    if (!user) {
      return false
    }

    // Check auth0 m2m client id
    const m2mClientAccess = this.reflector.get(
      M2M_CLIENT_ACCESS_DECORATOR_METADATA_KEY,
      context.getHandler()
    )
    const userClientId = user.clientId
    const isClientCredentials = user.isClientCredentials
    // m2m client id
    const m2mClientId = this.authModuleOptions?.m2mClientId

    // If user has m2m client id, check if it matches auth0 client id
    if (m2mClientAccess && m2mClientId) {
      if (isClientCredentials) {
        return m2mClientId === userClientId
      }
    }

    // Check valid roles
    const roles = this.reflector.get(ROLES_DECORATOR_METADATA_KEY, context.getHandler())

    if (roles && !this.utilService.arraysEqual(roles, user?.roles)) {
      return false
    }

    // Check valid permissions
    const permissions = this.reflector.get(PERMISSIONS_DECORATOR_METADATA_KEY, context.getHandler())

    if (permissions && !this.utilService.arraysEqual(permissions, user.permissions)) {
      return false
    }

    return true
  }
}
