import { passportJwtSecret } from 'jwks-rsa'
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt'

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { AUTH_MODULE_OPTIONS } from './constants'
import { AuthModuleOptions } from './interfaces/auth-module-options.interface'
import { JwtPayload } from './interfaces/jwt-payload'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(AUTH_MODULE_OPTIONS) authModuleOptions: AuthModuleOptions) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${authModuleOptions.issuer}.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: authModuleOptions.audience,
      issuer: authModuleOptions.issuer,
      algorithms: ['RS256'],
    })
  }

  validate(payload: JwtPayload, done: VerifiedCallback) {
    if (!payload) {
      done(new UnauthorizedException(), false)
    }

    return done(null, payload)
  }
}
