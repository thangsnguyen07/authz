import { HttpStatusCode } from 'axios'
import { catchError, lastValueFrom, map } from 'rxjs'

import { HttpService } from '@nestjs/axios'
import { HttpException, Inject, Injectable } from '@nestjs/common'

import { AuthModuleOptions, M2MToken, OAuthToken } from '@interfaces'

import { AUTH_MODULE_OPTIONS } from '@constants'

@Injectable()
export class Auth0Service {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS) private readonly authModuleOptions: AuthModuleOptions,
    private readonly httpService: HttpService
  ) {}

  generateM2MToken(): Promise<M2MToken> {
    const authTokenEndPoint = this.authModuleOptions.issuer + 'oauth/token'
    const clientId = this.authModuleOptions.m2mClientId
    const clientSecret = this.authModuleOptions.m2mClientSecret
    const audience = this.authModuleOptions.audience

    const request = this.httpService
      .post<OAuthToken>(authTokenEndPoint, {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
        audience: audience,
      })
      .pipe(
        map((response) => response.data),
        map((data) => {
          return {
            access_token: data.access_token,
            expires_in: data.expires_in,
            token_type: data.token_type,
          }
        }),
        catchError(() => {
          throw new HttpException('Cannot generate M2M token.', HttpStatusCode.BadRequest)
        })
      )

    return lastValueFrom(request)
  }
}
